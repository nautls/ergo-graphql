import { Address } from "@nautilus-js/fleet";
import {
  UnconfirmedBoxEntity,
  UnconfirmedInputEntity,
  UnconfirmedTransactionEntity
} from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type TransactionFindOptions = FindManyParams<UnconfirmedTransactionEntity> & {
  address?: string;
};

export class UnconfirmedTransactionRepository extends BaseRepository<UnconfirmedTransactionEntity> {
  constructor(context: RepositoryDataContext) {
    super(UnconfirmedTransactionEntity, "utx", { context });
  }

  public override async find(
    options: TransactionFindOptions
  ): Promise<UnconfirmedTransactionEntity[]> {
    const { address } = options;
    return this.findBase(options, (filterQuery) => {
      if (address) {
        const ergoTree = Address.fromBase58(address).ergoTree;

        const inputQuery = this.dataSource
          .getRepository(UnconfirmedBoxEntity)
          .createQueryBuilder("box")
          .select("input.transactionId", "transactionId")
          .leftJoin(UnconfirmedInputEntity, "input", "box.boxId = input.boxId")
          .where("box.ergoTree = :ergoTree");

        const outputQuery = this.dataSource
          .getRepository(UnconfirmedBoxEntity)
          .createQueryBuilder("box")
          .select("box.transactionId", "transactionId")
          .where("box.ergoTree = :ergoTree");

        filterQuery = filterQuery.innerJoin(
          `(${inputQuery.getQuery()} UNION ${outputQuery.getQuery()})`,
          "boxes",
          `"boxes"."transactionId" = ${this.alias}.transactionId`
        );

        filterQuery = filterQuery.setParameters({ ergoTree });
      }

      return filterQuery;
    });
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
