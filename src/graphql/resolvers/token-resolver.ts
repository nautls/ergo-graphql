import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Query, Resolver } from "type-graphql";
import { Token } from "../objects";
import { removeUndefined } from "../../utils";
import { PaginationArguments } from "./pagination-arguments";
import { GraphQLContext } from "../context-type";
import { ValidateIf, IsEmpty, ArrayMaxSize } from "class-validator";
import { TokenMintingBox } from "../input-types/token";

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

  @ValidateIf((o: TokensQueryArgs) => {
    if (!o.mintingBox) return false;
    else {
      const { ergoTree, address, additionalRegisters } = o.mintingBox;
      const count = [ergoTree, address, additionalRegisters].filter((el) => el).length;
      const ru = removeUndefined(additionalRegisters! as Record<string, string>);
      return count !== 2 || additionalRegisters === undefined || Object.keys(ru).length === 0;
    }
  })
  @IsEmpty({
    message: "MintingBox filter must have `registers` and exactly one of `ergoTree` or `address`"
  })
  @Field(() => TokenMintingBox, { nullable: true })
  mintingBox?: TokenMintingBox;
}

@Resolver(Token)
export class TokenResolver {
  @Query(() => [Token])
  async tokens(
    @Args({ validate: true }) { tokenId, tokenIds, boxId, name, mintingBox }: TokensQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    /**
     * Two Reg Bug
     * Linting
     * Tests/Docs
     */
    return context.repository.tokens.find({
      resolverInfo: info,
      where: removeUndefined({ boxId, tokenId }),
      tokenIds,
      name,
      mintingBox,
      skip,
      take
    });
  }
}
