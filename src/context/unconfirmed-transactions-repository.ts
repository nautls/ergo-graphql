import {
  UnconfirmedBoxEntity,
  UnconfirmedInputEntity,
  UnconfirmedTransactionEntity
} from "../entities";
import { removeUndefined } from "../utils";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type TransactionFindOptions = FindManyParams<UnconfirmedTransactionEntity> & {
  address?: string;
  transactionIds?: string[];
};

export class UnconfirmedTransactionRepository extends BaseRepository<UnconfirmedTransactionEntity> {
  constructor(context: RepositoryDataContext) {
    super(UnconfirmedTransactionEntity, "utx", { context });
  }

  public override async find(
    options: TransactionFindOptions
  ): Promise<UnconfirmedTransactionEntity[]> {
    const { address, transactionIds } = options;
    return this.findBase(options, (filterQuery) => {
      if (address) {
        const inputQuery = this.dataSource
          .getRepository(UnconfirmedBoxEntity)
          .createQueryBuilder("box")
          .select("input.transactionId", "transactionId")
          .leftJoin(UnconfirmedInputEntity, "input", "box.boxId = input.boxId")
          .where("box.address = :address");

        const outputQuery = this.dataSource
          .getRepository(UnconfirmedBoxEntity)
          .createQueryBuilder("box")
          .select("box.transactionId", "transactionId")
          .where("box.address = :address");

        filterQuery = filterQuery.innerJoin(
          `(${inputQuery.getQuery()} UNION ${outputQuery.getQuery()})`,
          "boxes",
          `"boxes"."transactionId" = ${this.alias}.transactionId`
        );
      }

      if (options.where?.transactionId && transactionIds) {
        transactionIds.push(options.where.transactionId);
        delete options.where.transactionId;
      }

      if (transactionIds) {
        filterQuery = filterQuery.andWhere(`${this.alias}.transactionId IN (:...transactionIds)`);
      }

      filterQuery = filterQuery.setParameters(removeUndefined({ address, transactionIds }));

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
