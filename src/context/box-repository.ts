import { unionBy } from "lodash";
import { AssetEntity, BoxEntity, InputEntity, TokenEntity } from "../entities";
import { removeUndefined } from "../utils";
import { BaseRepository, RepositoryDataContext } from "./base-repository";

export class BoxRepository extends BaseRepository<BoxEntity> {
  constructor(context: RepositoryDataContext) {
    super(BoxEntity, "box", context, { mainChain: true });
  }

  public async sum(options: {
    where: { addresses: string[]; maxHeight?: number };
    include: { nanoErgs: boolean; assets: boolean };
  }) {
    let baseQuery = this.repository
      .createQueryBuilder("box")
      .leftJoin(InputEntity, "input", "box.boxId = input.boxId")
      .where("box.address in (:...addresses)")
      .select("box.address", "address")
      .andWhere("input.boxId IS NULL")
      .groupBy("box.address")
      .setParameters(
        removeUndefined({
          addresses: options.where.addresses,
          height: options.where.maxHeight
        })
      );

    if (options.where.maxHeight) {
      baseQuery = baseQuery.andWhere("box.creationHeight <= :height");
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
