import { BoxEntity, InputEntity, TransactionEntity } from "../entities";
import { removeUndefined } from "../utils";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type TransactionFindOptions = FindManyParams<TransactionEntity> & {
  minHeight?: number;
  maxHeight?: number;
  address?: string;
};

export class TransactionRepository extends BaseRepository<TransactionEntity> {
  constructor(context: RepositoryDataContext) {
    super(TransactionEntity, "tx", {
      context,
      defaults: { where: { mainChain: true }, orderBy: { globalIndex: "DESC" } }
    });
  }

  public override async find(options: TransactionFindOptions): Promise<TransactionEntity[]> {
    const { minHeight, maxHeight, address } = options;
    return this.findBase(options, (query) => {
      if (address) {
        const inputQuery = this.createInputQuery(maxHeight);
        const outputQuery = this.createOutputQuery(maxHeight);

        query = query.innerJoin(
          `(${inputQuery.getQuery()} UNION ${outputQuery.getQuery()})`,
          "boxes",
          `"boxes"."transactionId" = ${this.alias}.transactionId`
        );
      }

      if (minHeight) {
        query = query.andWhere(`${this.alias}.inclusionHeight >= :minHeight`, { minHeight });
      }
      if (maxHeight) {
        query = query.andWhere(`${this.alias}.inclusionHeight <= :maxHeight`, { maxHeight });
      }

      query = query.setParameters(
        removeUndefined({ height: maxHeight, maxHeight, minHeight, address })
      );

      return query;
    });
  }

  public async count(options: { where: { address: string; maxHeight?: number } }): Promise<number> {
    const inputsQuery = this.createInputQuery(options.where.maxHeight);
    const outputsQuery = this.createOutputQuery(options.where.maxHeight);

    const { count } = await this.repository
      .createQueryBuilder(this.alias)
      .select("COUNT(DISTINCT(tx.transactionId))", "count")
      .innerJoin(
        `(${inputsQuery.getQuery()} UNION ${outputsQuery.getQuery()})`,
        "boxes",
        '"boxes"."transactionId" = tx.transactionId'
      )
      .where(`${this.alias}.mainChain = true`)
      .setParameters(
        removeUndefined({ address: options.where.address, height: options.where.maxHeight })
      )
      .getRawOne();

    return count;
  }

  private createOutputQuery(height?: number) {
    let query = this.dataSource
      .getRepository(BoxEntity)
      .createQueryBuilder("box")
      .select("box.transactionId", "transactionId")
      .where("box.mainChain = true AND box.address = :address");

    if (height) {
      query = query.andWhere("box.creationHeight <= :height");
    }

    return query;
  }

  private createInputQuery(height?: number) {
    let query = this.dataSource
      .getRepository(BoxEntity)
      .createQueryBuilder("box")
      .select("input.transactionId", "transactionId")
      .leftJoin(InputEntity, "input", "box.boxId = input.boxId AND input.mainChain = true")
      .where("box.mainChain = true AND box.address = :address");

    if (height) {
      query = query.andWhere("box.creationHeight <= :height");
    }

    return query;
  }
}
