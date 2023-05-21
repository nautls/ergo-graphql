import { ErgoAddress } from "@fleet-sdk/core";
import { unionBy } from "lodash";
import {
  TokenEntity,
  UnconfirmedAssetEntity,
  UnconfirmedBoxEntity,
  UnconfirmedInputEntity
} from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type UnconfirmedBoxFindOptions = FindManyParams<UnconfirmedBoxEntity> & {
  tokenId?: string;
  addresses?: string[];
  ergoTrees?: string[];
  // boxIds: string[];
};

export class UnconfirmedBoxRepository extends BaseRepository<UnconfirmedBoxEntity> {
  constructor(context: RepositoryDataContext) {
    super(UnconfirmedBoxEntity, "box", { context });
  }

  public override find(options: UnconfirmedBoxFindOptions): Promise<UnconfirmedBoxEntity[]> {
    const { tokenId, addresses } = options;

    const ergoTrees: string[] = options.ergoTrees ? options.ergoTrees : [];

    if (options.where?.ergoTree) {
      ergoTrees.push(options.where.ergoTree);
      delete options.where.ergoTree;
    }

    if (options.where?.address) {
      ergoTrees.push(ErgoAddress.fromBase58(options.where.address).ergoTree);
      delete options.where.address;
    }

    if (addresses) {
      for (const address of addresses) {
        ergoTrees.push(ErgoAddress.fromBase58(address).ergoTree);
      }
    }

    return this.findBase(options, (query) => {
      if (tokenId) {
        query = query
          .leftJoin("box.assets", "asset", "asset.boxId = box.boxId")
          .andWhere("asset.tokenId = :tokenId", { tokenId });
      }

      if (ergoTrees.length > 0) {
        query = query.andWhere(`${this.alias}.ergoTree IN (:...ergoTrees)`, { ergoTrees });
      }

      return query;
    });
  }

  public async sum(options: {
    where: { addresses: string[] };
    include: { nanoErgs: boolean; assets: boolean };
  }) {
    const query = this.repository
      .createQueryBuilder("box")
      .select("box.address", "address")
      .leftJoin(UnconfirmedInputEntity, "input", "box.boxId = input.boxId")
      .andWhere("box.ergoTree IN (:...ergoTrees)")
      .andWhere("input.boxId IS NULL")
      .groupBy("box.address")
      .setParameters({
        ergoTrees: options.where.addresses.map(
          (address) => ErgoAddress.fromBase58(address).ergoTree
        )
      });

    const nanoErgs = options.include.nanoErgs
      ? await query.addSelect("SUM(box.value)", "nanoErgs").getRawMany()
      : [];

    const assets = options.include.assets
      ? await query
          .leftJoin(UnconfirmedAssetEntity, "asset", "box.boxId = asset.boxId")
          .leftJoin(TokenEntity, "token", "asset.tokenId = token.tokenId")
          .andWhere("asset.tokenId IS NOT NULL")
          .addGroupBy("asset.tokenId")
          .addGroupBy("token.name")
          .addGroupBy("token.decimals")
          .addSelect("SUM(asset.value)", "amount")
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
