import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP } from "../../consts";
import { BlockInfoEntity } from "../../entities";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "../../utils";
import { Block } from "../objects/block";

@Resolver(Block)
export class BlockResolver {
  @Query(() => [Block])
  async blocks(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: 10 }) take: number,
    @Arg("headerId", () => String, { nullable: true }) headerId: string | undefined,
    @Arg("height", () => Number, { nullable: true }) height: number | undefined,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    const where = removeUndefined({
      headerId,
      height
    });

    return await context.loader
      .loadEntity(BlockInfoEntity, "block")
      .info(info)
      .ejectQueryBuilder((query) => {
        return query.where(where).skip(skip).take(take);
      })
      .loadMany();
  }
}
