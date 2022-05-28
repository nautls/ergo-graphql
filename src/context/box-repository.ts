import { AssetEntity, BoxEntity, InputEntity, TokenEntity } from "../entities";
import { removeUndefined } from "../utils";
import { BaseRepository } from "./base-repository";

export class BoxRepository extends BaseRepository<BoxEntity> {
  public async sum(options: {
    where: { address: string; maxHeight?: number };
    include: { nanoErgs: boolean; assets: boolean };
  }) {
    let baseQuery = this.repository
      .createQueryBuilder("box")
      .leftJoinAndSelect(InputEntity, "input", "box.boxId = input.boxId")
      .where("box.address = :address")
      .andWhere("input.boxId IS NULL")
      .setParameters(
        removeUndefined({
          address: options.where.address,
          height: options.where.maxHeight
        })
      );

    if (options.where.maxHeight) {
      baseQuery = baseQuery.andWhere("box.creationHeight <= :height");
    }

    const { nanoErgs } = options.include.nanoErgs
      ? await baseQuery.select("SUM(box.value)", "nanoErgs").getRawOne()
      : 0;

    const assets = options.include.assets
      ? await baseQuery
          .leftJoinAndSelect(AssetEntity, "asset", "box.boxId = asset.boxId")
          .leftJoinAndSelect(TokenEntity, "token", "asset.tokenId = token.tokenId")
          .andWhere("asset.tokenId IS NOT NULL")
          .groupBy("asset.tokenId")
          .addGroupBy("token.name")
          .addGroupBy("token.decimals")
          .select("sum(asset.value)", "amount")
          .addSelect("asset.tokenId", "tokenId")
          .addSelect("token.name", "name")
          .addSelect("token.decimals", "decimals")
          .getRawMany()
      : [];

    return { nanoErgs: nanoErgs ?? 0, assets };
  }
}
