import { ErgoAddress } from "@fleet-sdk/core";
import {
  BoxEntity,
  UnconfirmedBoxEntity,
  UnconfirmedInputEntity,
  UnconfirmedTransactionEntity
} from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type TransactionFindOptions = FindManyParams<UnconfirmedTransactionEntity> & {
  address?: string;
  addresses?: string[];
  transactionIds?: string[];
};

export class UnconfirmedTransactionRepository extends BaseRepository<UnconfirmedTransactionEntity> {
  constructor(context: RepositoryDataContext) {
    super(UnconfirmedTransactionEntity, "utx", { context });
  }

  public override async find(
    options: TransactionFindOptions
  ): Promise<UnconfirmedTransactionEntity[]> {
    const { address, addresses, transactionIds } = options;
    const ergoTrees = addresses
      ? addresses.map((address) => ErgoAddress.fromBase58(address).ergoTree)
      : [];
    const records = await this.findBase(options, (filterQuery) => {
      if (address) {
        ergoTrees.push(ErgoAddress.fromBase58(address).ergoTree);
      }

      if (ergoTrees.length > 0) {
        const inputQuery = this.dataSource
          .getRepository(UnconfirmedBoxEntity)
          .createQueryBuilder("box")
          .select("input.transactionId", "transactionId")
          .leftJoin(UnconfirmedInputEntity, "input", "box.boxId = input.boxId")
          .where("box.ergoTree IN (:...ergoTrees)");

        const outputQuery = this.dataSource
          .getRepository(UnconfirmedBoxEntity)
          .createQueryBuilder("box")
          .select("box.transactionId", "transactionId")
          .where("box.ergoTree IN (:...ergoTrees)");

        filterQuery = filterQuery.innerJoin(
          `(${inputQuery.getQuery()} UNION ${outputQuery.getQuery()})`,
          "boxes",
          `"boxes"."transactionId" = ${this.alias}.transactionId`
        );

        filterQuery = filterQuery.setParameters({ ergoTrees });
      }

      if (options.where?.transactionId && transactionIds) {
        transactionIds.push(options.where.transactionId);
        delete options.where.transactionId;
      }

      if (transactionIds && transactionIds.length > 0) {
        filterQuery = filterQuery.andWhere(`${this.alias}.transactionId IN (:...transactionIds)`, {
          transactionIds
        });
      }

      return filterQuery;
    });

    const unconfirmedBoxIds: string[] = [];
    records.forEach((record) => {
      if (record.inputs) {
        record.inputs.forEach((input) => {
          if (input.box === null) unconfirmedBoxIds.push(input.boxId);
        });
      }
    });
    if (unconfirmedBoxIds.length > 0) {
      const unconfimedBoxes = await this.dataSource
        .getRepository(UnconfirmedBoxEntity)
        .createQueryBuilder("box")
        .where("box.boxId IN (:...unconfirmedBoxIds)", { unconfirmedBoxIds })
        .getMany();

      const unconfimedBoxesMap = new Map<string, UnconfirmedBoxEntity>();
      unconfimedBoxes.forEach((box) => unconfimedBoxesMap.set(box.boxId, box));
      console.log(unconfimedBoxesMap);
      records.map((record) => {
        const inputs = record.inputs.map((input) => {
          if (input.box === null) {
            input.box = unconfimedBoxesMap.get(input.boxId) as BoxEntity;
          }
          return input;
        });
        record.inputs = inputs;
        return records;
      });
    }

    return records;
  }

  public async count(): Promise<number> {
    const { count } = await this.repository
      .createQueryBuilder(this.alias)
      .select("COUNT(utx.transactionId)", "count")
      .getRawOne();

    return count || 0;
  }

  public async sum(options: { by: "size" }) {
    const { sum } = await this.repository
      .createQueryBuilder(this.alias)
      .select(`SUM(utx.${options.by})`, "sum")
      .getRawOne();

    return sum || 0;
  }
}
