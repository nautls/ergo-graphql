import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Query, Resolver } from "type-graphql";
import { Token } from "../objects";
import { removeUndefined } from "../../utils";
import { PaginationArguments } from "./pagination-arguments";
import { GraphQLContext } from "../context-type";

@ArgsType()
class TokensQueryArgs {
  @Field(() => [String], { nullable: true })
  tokenIds?: [string];

  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  name?: string;
}

@Resolver(Token)
export class TokenResolver {
  @Query(() => [Token])
  async tokens(
    @Args() { tokenIds, boxId, name }: TokensQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.tokens.find({
      resolverInfo: info,
      where: removeUndefined({ boxId, name }),
      tokenIds,
      skip,
      take
    });
  }
}
