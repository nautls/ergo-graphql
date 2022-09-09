import { Address } from "@nautilus-js/fleet";
import { isEmpty, unionBy } from "lodash";
import { AssetEntity, BoxEntity, InputEntity, TokenEntity } from "../entities";
import { removeUndefined } from "../utils";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { FindManyParams } from "./repository-interface";

type Registers = {
  R4?: string;
  R5?: string;
  R6?: string;
  R7?: string;
  R8?: string;
  R9?: string;
};

type BoxFindOptions = FindManyParams<BoxEntity> & {
  spent?: boolean;
  tokenId?: string;
  registers?: Registers;
};

export class BoxRepository extends BaseRepository<BoxEntity> {
  constructor(context: RepositoryDataContext) {
    super(BoxEntity, "box", {
      context,
      defaults: { where: { mainChain: true }, orderBy: { globalIndex: "ASC" } }
    });
  }

  public override find(options: BoxFindOptions): Promise<BoxEntity[]> {
    const { spent, tokenId, registers } = options;
    if (options.where?.address) {
      options.where.ergoTree = Address.fromBase58(options.where.address).ergoTree;
      delete options.where.address;
    }

    return this.findBase(options, (query) => {
      if (spent !== undefined && spent !== null) {
        query = query.leftJoin(
          "box.spentBy",
          "input",
          "input.boxId = box.boxId AND input.mainChain = true"
        );

        query = spent
          ? query.andWhere("input.boxId IS NOT NULL")
          : query.andWhere("input.boxId IS NULL");
      }

      if (tokenId) {
        query = query
          .leftJoin("box.assets", "asset", "asset.boxId = box.boxId")
          .andWhere("asset.tokenId = :tokenId", { tokenId });
      }

      if (registers && !isEmpty(registers)) {
        query = query.leftJoin("box.registers", "rx", "box.boxId = rx.boxId");
        for (const key in registers) {
          const value = registers[key as keyof Registers];
          if (!value) {
            continue;
          }

          query = query.andWhere(
            `rx.registerId = :${key}_key AND rx.serializedValue = :${key}_value`,
            removeUndefined({
              tokenId,
              R4_key: registers?.R4 ? "R4" : undefined,
              R4_value: registers?.R4,
              R5_key: registers?.R5 ? "R5" : undefined,
              R5_value: registers?.R5,
              R6_key: registers?.R6 ? "R6" : undefined,
              R6_value: registers?.R6,
              R7_key: registers?.R7 ? "R7" : undefined,
              R7_value: registers?.R7,
              R8_key: registers?.R8 ? "R8" : undefined,
              R8_value: registers?.R8,
              R9_key: registers?.R9 ? "R9" : undefined,
              R9_value: registers?.R9
            })
          );
        }
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
      .leftJoin(InputEntity, "input", "box.boxId = input.boxId AND input.mainChain = true")
      .where("box.mainChain = true")
      .andWhere("box.ergoTree IN (:...ergoTrees)")
      .andWhere("input.boxId IS NULL")
      .groupBy("box.address")
      .setParameters(
        removeUndefined({
          ergoTrees: options.where.addresses.map((address) => Address.fromBase58(address).ergoTree),
          height: options.where.maxHeight
        })
      );

    if (options.where.maxHeight) {
      baseQuery = baseQuery.andWhere("box.settlementHeight <= :height");
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

  public async getMaxGlobalIndex(): Promise<number | undefined> {
    const { globalIndex } = await this.repository
      .createQueryBuilder("box")
      .select("MAX(global_index)", "globalIndex")
      .getRawOne();

    return globalIndex;
  }

  public async getAddressesBoxCount(options: {
    where: { addresses: string[]; maxHeight?: number };
  }) {
    let baseQuery = this.repository
      .createQueryBuilder("box")
      .select("COUNT(*)", "boxesCount")
      .addSelect("box.address", "address")
      .where("box.ergoTree IN (:...ergoTrees)")
      .groupBy("box.address");

    if (options.where.maxHeight) {
      baseQuery = baseQuery.andWhere("box.settlementHeight <= :height");
    }

    return baseQuery
      .setParameters(
        removeUndefined({
          ergoTrees: options.where.addresses.map((address) => Address.fromBase58(address).ergoTree),
          height: options.where.maxHeight
        })
      )
      .getRawMany();
  }
}
