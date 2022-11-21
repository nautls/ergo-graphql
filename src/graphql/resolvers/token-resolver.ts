import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Query, Resolver } from "type-graphql";
import { Token } from "../objects";
import { removeUndefined } from "../../utils";
import { PaginationArguments } from "./pagination-arguments";
import { GraphQLContext } from "../context-type";
import { ValidateIf, IsEmpty, ArrayMaxSize } from "class-validator";

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

  @ValidateIf((o: TokensQueryArgs) => {
    if (o.name) {
      const starCount = (o.name.match(/\*/g) || []).length;
      return starCount > 2;
    }

    return false;
  })
  @IsEmpty({ message: "Number of wildcard chars can't exceed 2." })
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
      where: removeUndefined({ boxId, tokenId }),
      tokenIds,
      name,
      skip,
      take
    });
  }
}
