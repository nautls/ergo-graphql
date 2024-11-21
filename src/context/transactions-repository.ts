import { ErgoAddress } from "@fleet-sdk/core";
import { MINER_FEE_ERGO_TREE } from "../consts";
import { BoxEntity, InputEntity, TransactionEntity } from "../entities";
import { getArgumentValue } from "../graphql/resolvers/utils";
import { removeUndefined } from "../utils";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type TransactionFindOptions = FindManyParams<TransactionEntity> & {
  minHeight?: number;
  maxHeight?: number;
  address?: string;
  addresses?: string[];
  transactionIds?: string[];
  headerIds?: string[];
};

export class TransactionRepository extends BaseRepository<TransactionEntity> {
  constructor(context: RepositoryDataContext) {
    super(TransactionEntity, "tx", {
      context,
      defaults: { where: { mainChain: true }, orderBy: { timestamp: "DESC" } }
    });
  }

  public override async find(options: TransactionFindOptions): Promise<TransactionEntity[]> {
    const { minHeight, maxHeight, address, addresses, transactionIds, headerIds } = options;
    const ergoTrees = addresses
      ? addresses.map((address) => ErgoAddress.fromBase58(address).ergoTree)
      : [];

    return this.findBase(
      options,
      (filterQuery) => {
        if (address) {
          ergoTrees.push(ErgoAddress.fromBase58(address).ergoTree);
        }
        if (ergoTrees.length > 0) {
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

        if (options.where?.transactionId && transactionIds) {
          transactionIds.push(options.where.transactionId);
          delete options.where.transactionId;
        }

        if (transactionIds && transactionIds.length > 0) {
          filterQuery = filterQuery.andWhere(`${this.alias}.transactionId IN (:...transactionIds)`);
        }

        if (options.where?.headerId && headerIds) {
          headerIds.push(options.where.headerId);
          delete options.where.headerId;
        }

        if (headerIds && headerIds.length > 0) {
          filterQuery = filterQuery.andWhere(`${this.alias}.headerId IN (:...headerIds)`);
        } 

        filterQuery = filterQuery.setParameters(
          removeUndefined({
            height: maxHeight,
            maxHeight,
            minHeight,
            ergoTrees,
            transactionIds,
            headerIds
          })
        );

        return filterQuery;
      },
      (selectQuery) => {
        selectQuery.andWhere(`${this.alias}.mainChain = true`);

        if (
          ergoTrees.length > 0 &&
          getArgumentValue(options.resolverInfo, "outputs", "relevantOnly") === true
        ) {
          const outputsJoin = selectQuery.expressionMap.joinAttributes.find(
            (x) => x.relation?.propertyName === "outputs"
          );

          if (outputsJoin) {
            const minerTreeCondition = `${outputsJoin.alias.name}.ergoTree = :minerTree`;
            const relevantCondition = `${outputsJoin.alias.name}.ergoTree IN (:...ergoTrees) OR ${minerTreeCondition}`;
            outputsJoin.condition = outputsJoin.condition
              ? `${outputsJoin.condition} AND (${relevantCondition})`
              : relevantCondition;
            selectQuery = selectQuery.setParameters({
              minerTree: MINER_FEE_ERGO_TREE
            });
          }
        }

        return selectQuery;
      }
    );
  }

  public async count(options: { where: { address: string } }): Promise<number> {
    const inputsQuery = this.createInputQuery();
    const outputsQuery = this.createOutputQuery();

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
        removeUndefined({
          ergoTrees: [ErgoAddress.fromBase58(options.where.address).ergoTree]
        })
      )
      .getRawOne();

    return count;
  }

  public async getMaxGlobalIndex(): Promise<number | undefined> {
    const { globalIndex } = await this.repository
      .createQueryBuilder("trx")
      .select("MAX(global_index)", "globalIndex")
      .getRawOne();

    return globalIndex;
  }

  private createOutputQuery(height?: number) {
    let query = this.dataSource
      .getRepository(BoxEntity)
      .createQueryBuilder("box")
      .select("box.transactionId", "transactionId")
      .where("box.mainChain = true AND box.ergoTree IN (:...ergoTrees)");

    if (height) {
      query = query.andWhere("box.settlementHeight <= :height");
    }

    return query;
  }

  private createInputQuery(height?: number) {
    let query = this.dataSource
      .getRepository(BoxEntity)
      .createQueryBuilder("box")
      .select("input.transactionId", "transactionId")
      .leftJoin(InputEntity, "input", "box.boxId = input.boxId AND input.mainChain = true")
      .where("box.mainChain = true AND box.ergoTree IN (:...ergoTrees)");

    if (height) {
      query = query.andWhere("box.settlementHeight <= :height");
    }

    return query;
  }
}
