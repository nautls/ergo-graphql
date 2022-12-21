import { ErgoAddress } from "@fleet-sdk/core";
import { isEmpty, unionBy } from "lodash";
import { AssetEntity, BoxEntity, HeaderEntity, InputEntity, TokenEntity } from "../entities";
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
  addresses?: string[];
  ergoTrees?: string[];
  spent?: boolean;
  tokenId?: string;
  containsTokens?: string[];
  registers?: Registers;
  minHeight?: number;
  maxHeight?: number;
  boxIds?: string[];
};

export class BoxRepository extends BaseRepository<BoxEntity> {
  constructor(context: RepositoryDataContext) {
    super(BoxEntity, "box", {
      context,
      defaults: { where: { mainChain: true }, orderBy: { globalIndex: "DESC" } }
    });
  }

  public override find(options: BoxFindOptions): Promise<BoxEntity[]> {
    const { spent, tokenId, registers, minHeight, maxHeight, addresses, boxIds, containsTokens } =
      options;

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

    return this.findBase(
      options,
      (query) => {
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

        if (ergoTrees.length > 0) {
          query = query.andWhere("box.ergoTree IN (:...ergoTrees)", { ergoTrees });
        }

        if (tokenId) {
          query = query
            .leftJoin("box.assets", "asset", "asset.boxId = box.boxId")
            .andWhere("asset.tokenId = :tokenId", { tokenId });
        }

        if (containsTokens && containsTokens.length > 0) {
          query = query
            .leftJoin("box.assets", "asset", "asset.boxId = box.boxId")
            .andWhere("asset.tokenId IN (:...containsTokens)", { containsTokens });
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

        if (minHeight) {
          query = query.andWhere(`${this.alias}.settlement_height >= :minHeight`, { minHeight });
        }

        if (maxHeight) {
          query = query.andWhere(`${this.alias}.settlement_height <= :maxHeight`, { maxHeight });
        }

        if (options.where?.boxId && boxIds) {
          boxIds.push(options.where.boxId);
          delete options.where.boxId;
        }

        if (boxIds && boxIds.length > 0) {
          query = query.andWhere(`${this.alias}.box_id IN (:...boxIds)`, { boxIds });
        }

        return query;
      },
      (selectQuery) => {
        return selectQuery.andWhere(`${this.alias}.mainChain = true`);
      }
    );
  }

  public async sum(options: {
    where: { addresses: string[] };
    include: { nanoErgs: boolean; assets: boolean };
  }) {
    const baseQuery = this.repository
      .createQueryBuilder("box")
      .select("box.address", "address")
      .leftJoin(InputEntity, "input", "box.boxId = input.boxId AND input.mainChain = true")
      .where("box.mainChain = true")
      .andWhere("box.ergoTree IN (:...ergoTrees)")
      .andWhere("input.boxId IS NULL")
      .groupBy("box.address")
      .setParameters(
        removeUndefined({
          ergoTrees: options.where.addresses.map(
            (address) => ErgoAddress.fromBase58(address).ergoTree
          )
        })
      );

    const nanoErgs = options.include.nanoErgs
      ? await baseQuery.clone().addSelect("SUM(box.value)", "nanoErgs").getRawMany()
      : [];

    const assets = options.include.assets
      ? await baseQuery
          .leftJoin(AssetEntity, "asset", "box.boxId = asset.boxId")
          .innerJoin(
            HeaderEntity,
            "header",
            "asset.headerId = header.headerId and header.mainChain = true"
          )
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

  public async getAddressesBoxCount(options: { where: { addresses: string[] } }) {
    const baseQuery = this.repository
      .createQueryBuilder("box")
      .select("COUNT(*)", "boxesCount")
      .addSelect("box.address", "address")
      .where("box.ergoTree IN (:...ergoTrees)")
      .groupBy("box.address");

    return baseQuery
      .setParameters(
        removeUndefined({
          ergoTrees: options.where.addresses.map(
            (address) => ErgoAddress.fromBase58(address).ergoTree
          )
        })
      )
      .getRawMany();
  }
}
