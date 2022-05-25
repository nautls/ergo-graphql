import { GraphQLResolveInfo } from "graphql";
import { Arg, FieldResolver, Info, Int, Query, Resolver, Root } from "type-graphql";
import { appDataSource } from "../../data-source";
import { AssetEntity, BoxEntity, InputEntity, TokenEntity } from "../../entities";
import { Address } from "../objects/address";
import { isFieldSelected } from "./utils";

@Resolver(Address)
export class AddressResolver {
  @Query(() => Address)
  async addresses(
    @Arg("address", () => String, { nullable: false }) address: string,
    @Arg("atHeight", () => Int, { nullable: true }) atHeight: number
  ) {
    return { args: { address, atHeight } };
  }

  @FieldResolver()
  async balance(
    @Root() root: { args: { address: string; atHeight: number } },
    @Info() info: GraphQLResolveInfo
  ) {
    const repository = appDataSource.getRepository(BoxEntity);
    let baseQuery = repository
      .createQueryBuilder("box")
      .leftJoinAndSelect(InputEntity, "input", "box.boxId = input.boxId")
      .where("box.address = :address", { address: root.args.address })
      .andWhere("input.boxId IS NULL");

    if (root.args.atHeight) {
      baseQuery = baseQuery.andWhere("box.creationHeight <= :height", {
        height: root.args.atHeight
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
  async transactionsCount(@Root() root: { args: { address: string; atHeight: number } }) {
    let query = appDataSource
      .getRepository(InputEntity)
      .createQueryBuilder("input")
      .leftJoin(BoxEntity, "box", "box.boxId = input.boxId")
      .select("COUNT(DISTINCT(input.transactionId))", "count")
      .where("box.address = :address", { address: root.args.address });

    if (root.args.atHeight) {
      query = query.andWhere("box.creationHeight <= :height", {
        height: root.args.atHeight
      });
    }

    const { count } = await query.getRawOne();

    return count;
  }
}
