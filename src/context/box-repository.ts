import { unionBy } from "lodash";
import { AssetEntity, BoxEntity, InputEntity, TokenEntity, TransactionEntity } from "../entities";
import { removeUndefined } from "../utils";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type BoxFindOptions = FindManyParams<BoxEntity> & {
  spent?: boolean;
  tokenId?: string;
};

export class BoxRepository extends BaseRepository<BoxEntity> {
  constructor(context: RepositoryDataContext) {
    super(BoxEntity, "box", context, { mainChain: true });
  }

  public override find(options: BoxFindOptions): Promise<BoxEntity[]> {
    const { spent, tokenId } = options;
    return this.findBase(options, (query) => {
      if (spent !== undefined && spent !== null) {
        query = query.leftJoin(
          InputEntity,
          "input",
          `input.boxId = ${this.alias}.boxId and input.mainChain = true`
        );

        query = spent ? query.where("input.boxId IS NOT NULL") : query.where("input.boxId IS NULL");
      }

      if (tokenId) {
        query = query.innerJoin(
          AssetEntity,
          "asset",
          "asset.boxId = box.boxId and asset.tokenId = :tokenId",
          { tokenId }
        );
      }

      return query;
    });
  }

  public async sum(options: {
    where: { addresses: string[]; maxHeight?: number };
    include: { nanoErgs: boolean; assets: boolean };
  }) {
    let baseQuery = this.repository
      .createQueryBuilder("box")
      .select("box.address", "address")
      .leftJoin(InputEntity, "input", "box.boxId = input.boxId and input.mainChain = true")
      .where("box.mainChain = true")
      .andWhere("box.address in (:...addresses)")
      .andWhere("input.boxId IS NULL")
      .groupBy("box.address")
      .setParameters(
        removeUndefined({
          addresses: options.where.addresses,
          height: options.where.maxHeight
        })
      );

    if (options.where.maxHeight) {
      baseQuery = baseQuery
        .leftJoin(
          TransactionEntity,
          "tx",
          "tx.transactionId = input.transactionId and tx.inclusionHeight <= :height"
        )
        .andWhere("box.creationHeight <= :height");
    }

    const nanoErgs = options.include.nanoErgs
      ? await baseQuery.addSelect("SUM(box.value)", "nanoErgs").getRawMany()
      : [];

    const assets = options.include.assets
      ? await baseQuery
          .leftJoin(AssetEntity, "asset", "box.boxId = asset.boxId")
          .leftJoin(TokenEntity, "token", "asset.tokenId = token.tokenId")
          .andWhere("asset.tokenId IS NOT NULL")
          .addGroupBy("asset.tokenId")
          .addGroupBy("token.name")
          .addGroupBy("token.decimals")
          .addSelect("sum(asset.value)", "amount")
          .addSelect("asset.tokenId", "tokenId")
          .addSelect("token.name", "name")
          .addSelect("token.decimals", "decimals")
          .getRawMany()
      : [];

    return unionBy(nanoErgs, assets, (x) => x.address)
      .map((x) => x.address)
      .map((address) => {
        return {
          address,
          nanoErgs: nanoErgs.find((x) => x.address === address)?.nanoErgs || 0,
          assets: assets
            .filter((x) => x.address === address)
            .map((x) => {
              return {
                tokenId: x.tokenId,
                amount: x.amount,
                name: x.name,
                decimals: x.decimals
              };
            })
        };
      });
  }
}
