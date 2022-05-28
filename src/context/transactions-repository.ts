import { BoxEntity, InputEntity, TransactionEntity } from "../entities";
import { removeUndefined } from "../utils";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type TransactionFindOptions = FindManyParams<TransactionEntity> & {
  fromHeight?: number;
  toHeight?: number;
};

export class TransactionRepository extends BaseRepository<TransactionEntity> {
  constructor(context: RepositoryDataContext) {
    super(TransactionEntity, "tx", context);
  }

  public override async find(options: TransactionFindOptions): Promise<TransactionEntity[]> {
    return this.findBase(options, (query) => {
      const { fromHeight, toHeight } = options;

      if (fromHeight) {
        query = query.andWhere(`${query.alias}.inclusionHeight > :fromHeight`, { fromHeight });
      }
      if (toHeight) {
        query = query.andWhere(`${query.alias}.inclusionHeight < :toHeight`, { toHeight });
      }

      return query;
    });
  }

  public async count(options: { where: { address: string; maxHeight?: number } }): Promise<number> {
    let inputsQuery = this.dataSource
      .getRepository(BoxEntity)
      .createQueryBuilder("box")
      .select("input.transactionId", "transactionId")
      .leftJoin(InputEntity, "input", "box.boxId = input.boxId AND input.mainChain = true")
      .where("box.mainChain = true AND box.address = :address");
    let outputsQuery = this.dataSource
      .getRepository(BoxEntity)
      .createQueryBuilder("box")
      .select("box.transactionId", "transactionId")
      .where("box.mainChain = true AND box.address = :address");

    if (options.where.maxHeight) {
      inputsQuery = inputsQuery.andWhere("box.creationHeight <= :height");
      outputsQuery = outputsQuery.andWhere("box.creationHeight <= :height");
    }

    const { count } = await this.repository
      .createQueryBuilder(this.alias)
      .select("COUNT(DISTINCT(tx.transactionId))", "count")
      .innerJoin(
        `(${inputsQuery.getSql()} UNION ${outputsQuery.getSql()})`,
        "boxes",
        '"boxes"."transactionId" = tx.transactionId'
      )
      .where("tx.mainChain = true")
      .setParameters(
        removeUndefined({ address: options.where.address, height: options.where.maxHeight })
      )
      .getRawOne();

    return count;
  }
}
