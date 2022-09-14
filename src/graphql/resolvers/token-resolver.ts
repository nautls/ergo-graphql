import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Query, Resolver } from "type-graphql";
import { Token } from "../objects";
import { removeUndefined } from "../../utils";
import { PaginationArguments } from "./pagination-arguments";
import { GraphQLContext } from "../context-type";
import { ArrayMaxSize } from "class-validator";

@ArgsType()
class TokensQueryArgs {
  /** @deprecated */
  @Field(() => String, { nullable: true })
  tokenId?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(20)
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
    @Args({ validate: true }) { tokenId, tokenIds, boxId, name }: TokensQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.tokens.find({
      resolverInfo: info,
      where: removeUndefined({ boxId, name, tokenId }),
      tokenIds,
      skip,
      take
    });
  }
}
