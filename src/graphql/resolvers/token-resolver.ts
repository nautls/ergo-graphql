import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { Token } from "../objects";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";

@Resolver(Token)
export class TokenResolver {
  @Query(() => [Token])
  async tokens(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: MAX_TAKE }) take: number,
    @Arg("boxId", () => String, { nullable: true }) boxId: string | undefined,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.tokens.find({
      resolverInfo: info,
      where: removeUndefined({ boxId }),
      skip,
      take
    });
  }
}
