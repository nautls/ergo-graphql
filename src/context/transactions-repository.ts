import { MAINNET, MAINNET_MINER_FEE_ERGO_TREE, TESTNET_MINER_FEE_ERGO_TREE } from "../consts";
import { BoxEntity, InputEntity, TransactionEntity } from "../entities";
import { getArgumentValue } from "../graphql/resolvers/utils";
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
    return this.findBase(
      options,
      (filterQuery) => {
        if (address) {
          const inputQuery = this.createInputQuery(maxHeight);
          const outputQuery = this.createOutputQuery(maxHeight);

          filterQuery = filterQuery.innerJoin(
            `(${inputQuery.getQuery()} UNION ${outputQuery.getQuery()})`,
            "boxes",
            `"boxes"."transactionId" = ${this.alias}.transactionId`
          );
        }

        if (minHeight) {
          filterQuery = filterQuery.andWhere(`${this.alias}.inclusionHeight >= :minHeight`, {
            minHeight
          });
        }
        if (maxHeight) {
          filterQuery = filterQuery.andWhere(`${this.alias}.inclusionHeight <= :maxHeight`, {
            maxHeight
          });
        }

        filterQuery = filterQuery.setParameters(
          removeUndefined({ height: maxHeight, maxHeight, minHeight, address })
        );

        return filterQuery;
      },
      (selectQuery) => {
        if (address && getArgumentValue(options.resolverInfo, "outputs", "onlyRelevant") === true) {
          const outputsJoin = selectQuery.expressionMap.joinAttributes.find(
            (x) => x.relation?.propertyName === "outputs"
          );

          if (outputsJoin) {
            const treeCondition = MAINNET
              ? `${outputsJoin.alias.name}.ergoTree = :minerTree`
              : `${outputsJoin.alias.name}.ergoTree IN (:...minerTree)`;
            const relevantCondition = `${outputsJoin.alias.name}.address = :address OR ${treeCondition}`;
            outputsJoin.condition = outputsJoin.condition
              ? `${outputsJoin.condition} AND (${relevantCondition})`
              : relevantCondition;
            selectQuery = selectQuery.setParameters({
              minerTree: MAINNET
                ? MAINNET_MINER_FEE_ERGO_TREE
                : [MAINNET_MINER_FEE_ERGO_TREE, TESTNET_MINER_FEE_ERGO_TREE]
            });
          }
        }

        return selectQuery;
      }
    );
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

  public async getMaxTransactionIndex(): Promise<number | undefined> {
    const { index } = await this.repository
      .createQueryBuilder("trx")
      .select("MAX(index)", "index")
      .getRawOne();

    return index;
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
