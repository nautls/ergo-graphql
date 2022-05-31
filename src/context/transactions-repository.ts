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
    super(TransactionEntity, "tx", context, { mainChain: true });
  }

  public override async find(options: TransactionFindOptions): Promise<TransactionEntity[]> {
    const { minHeight, maxHeight, address } = options;

    let idsQuery = this.repository
      .createQueryBuilder("txId")
      .where("txId.mainChain = true")
      .skip(options.skip)
      .take(options.take);

    if (address) {
      const inputQuery = this.createInputQuery(maxHeight);
      const outputQuery = this.createOutputQuery(maxHeight);
      idsQuery = idsQuery
        .select(`"boxes"."transactionId"`)
        .from(`(${inputQuery.getQuery()} UNION ${outputQuery.getQuery()})`, "boxes");
    } else {
      idsQuery = idsQuery.select("txId.transactionId", "txId");
    }

    if (minHeight) {
      idsQuery = idsQuery.andWhere("txId.inclusionHeight >= :minHeight", { minHeight });
    }
    if (maxHeight) {
      idsQuery = idsQuery.andWhere("txId.inclusionHeight <= :maxHeight", { maxHeight });
    }

    options.take = undefined;
    options.skip = undefined;
    return this.findBase(options, (query) =>
      query
        .andWhere(`${this.alias}.transactionId in (${idsQuery.getQuery()})`)
        .setParameters(removeUndefined({ height: maxHeight, maxHeight, minHeight, address }))
    );
  }

  public async count(options: { where: { address: string; maxHeight?: number } }): Promise<number> {
    const inputsQuery = this.createInputQuery(options.where.maxHeight);
    const outputsQuery = this.createOutputQuery(options.where.maxHeight);

    const { count } = await this.repository
      .createQueryBuilder(this.alias)
      .select("COUNT(DISTINCT(tx.transactionId))", "count")
      .innerJoin(
        `(${inputsQuery.getSql()} UNION ${outputsQuery.getSql()})`,
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
