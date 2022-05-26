import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, FieldResolver, Info, Int, Query, Resolver } from "type-graphql";
import { appDataSource } from "../../data-source";
import {
  AssetEntity,
  BoxEntity,
  InputEntity,
  TokenEntity,
  TransactionEntity
} from "../../entities";
import { Address } from "../objects/address";
import { isFieldSelected } from "./utils";

@Resolver(Address)
export class AddressResolver {
  @Query(() => Address)
  async addresses(
    @Arg("address", () => String, { nullable: false }) address: string,
    @Arg("atHeight", () => Int, { nullable: true }) atHeight: number,
    @Ctx() context: { args: { address: string; atHeight: number } }
  ) {
    context.args = { address, atHeight };
    return {};
  }

  @FieldResolver()
  async balance(
    @Ctx() context: { args: { address: string; atHeight: number } },
    @Info() info: GraphQLResolveInfo
  ) {
    const repository = appDataSource.getRepository(BoxEntity);
    let baseQuery = repository
      .createQueryBuilder("box")
      .leftJoinAndSelect(InputEntity, "input", "box.boxId = input.boxId")
      .where("box.address = :address", { address: context.args.address })
      .andWhere("input.boxId IS NULL");

    if (context.args.atHeight) {
      baseQuery = baseQuery.andWhere("box.creationHeight <= :height", {
        height: context.args.atHeight
      });
    }

    const { nanoErgs } = isFieldSelected(info, "nanoErgs")
      ? await baseQuery.select("SUM(box.value)", "nanoErgs").getRawOne()
      : 0;

    const assets = isFieldSelected(info, "assets")
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

  @FieldResolver()
  async transactionsCount(@Ctx() context: { args: { address: string; atHeight: number } }) {
    let inputsQuery = appDataSource
      .getRepository(BoxEntity)
      .createQueryBuilder("box")
      .select("input.transactionId", "transactionId")
      .leftJoin(InputEntity, "input", "box.boxId = input.boxId and input.mainChain = true")
      .where("box.mainChain = true and box.address = :address");
    let outputsQuery = appDataSource
      .getRepository(BoxEntity)
      .createQueryBuilder("box")
      .select("box.transactionId", "transactionId")
      .where("box.mainChain = true and box.address = :address");

    if (context.args.atHeight) {
      inputsQuery = inputsQuery.andWhere("box.creationHeight <= :height");
      outputsQuery = outputsQuery.andWhere("box.creationHeight <= :height");
    }

    const { count } = await appDataSource
      .getRepository(TransactionEntity)
      .createQueryBuilder("tx")
      .select("COUNT(DISTINCT(tx.transactionId))", "count")
      .innerJoin(
        `(${inputsQuery.getSql()} UNION ${outputsQuery.getSql()})`,
        "boxes",
        '"boxes"."transactionId" = tx.transactionId'
      )
      .where("tx.mainChain = true")
      .setParameters({ address: context.args.address, height: context.args.atHeight })
      .getRawOne();

    return count;
  }
}
