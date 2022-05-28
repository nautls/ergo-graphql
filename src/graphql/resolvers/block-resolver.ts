import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP } from "../../consts";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "../../utils";
import { Block } from "../objects/block";
import { GraphQLContext } from "../context-type";

@Resolver(Block)
export class BlockResolver {
  @Query(() => [Block])
  async blocks(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: 10 }) take: number,
    @Arg("headerId", () => String, { nullable: true }) headerId: string | undefined,
    @Arg("height", () => Number, { nullable: true }) height: number | undefined,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.blockInfo.find({
      resolverInfo: info,
      where: removeUndefined({ headerId, height }),
      take,
      skip
    });
  }
}
