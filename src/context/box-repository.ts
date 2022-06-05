import { isEmpty, unionBy } from "lodash";
import {
  AssetEntity,
  BoxEntity,
  BoxRegisterEntity,
  InputEntity,
  TokenEntity,
  TransactionEntity
} from "../entities";
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
    super(BoxEntity, "box", { context, defaults: { orderBy: { globalIndex: "DESC" } } });
  }

  public override find(options: BoxFindOptions): Promise<BoxEntity[]> {
    const { spent, tokenId, registers, where, skip, take } = options;
    let idsQuery = this.repository
      .createQueryBuilder("bid")
      .select("bid.boxId", "boxId")
      .andWhere("bid.mainChain = true")
      .skip(skip)
      .take(take);

    if (where && !isEmpty(where)) {
      idsQuery = idsQuery.where(where);
    }

    if (spent !== undefined && spent !== null) {
      idsQuery = idsQuery.leftJoin(
        InputEntity,
        "input",
        "input.boxId = bid.boxId and input.mainChain = true"
      );

      idsQuery = spent
        ? idsQuery.where("input.boxId IS NOT NULL")
        : idsQuery.where("input.boxId IS NULL");
    }

    if (tokenId) {
      idsQuery = idsQuery.innerJoin(
        AssetEntity,
        "asset",
        "asset.boxId = bid.boxId and asset.tokenId = :tokenId",
        { tokenId }
      );
    }

    if (registers && !isEmpty(registers)) {
      idsQuery = idsQuery.leftJoin(BoxRegisterEntity, "rx", "bid.boxId = rx.boxId");
      for (const key in registers) {
        console.log(key);
        const value = registers[key as keyof Registers];
        if (!value) {
          continue;
        }

        idsQuery = idsQuery.andWhere(
          `rx.registerId = :${key}_key and rx.serializedValue = :${key}_value`
        );
      }
    }

    const limitQuery = this.dataSource
      .createQueryBuilder()
      .select(`DISTINCT("ids"."boxId")`, "boxId")
      .from(`(${idsQuery.getQuery()})`, "ids")
      .skip(skip)
      .take(take);

    return this.findBase({ resolverInfo: options.resolverInfo }, (query) =>
      query
        .andWhere(`${this.alias}.boxId in (${limitQuery.getQuery()})`)
        .setParameters(idsQuery.getParameters())
        .setParameters(
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
        )
    );
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
