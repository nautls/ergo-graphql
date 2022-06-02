import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Query, Resolver } from "type-graphql";
import { Box } from "../objects";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class BoxesQueryArgs {
  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => Boolean, { nullable: true })
  spent?: boolean;

  @Field(() => String, { nullable: true })
  tokenId?: string;

  @Field(() => String, { nullable: true })
  ergoTree?: string;

  @Field(() => String, { nullable: true })
  ergoTreeTemplateHash?: string;
}

@Resolver(Box)
export class BoxResolver {
  @Query(() => [Box])
  async boxes(
    @Args()
    {
      address,
      boxId,
      transactionId,
      headerId,
      ergoTree,
      ergoTreeTemplateHash,
      tokenId,
      spent
    }: BoxesQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.boxes.find({
      resolverInfo: info,
      where: removeUndefined({
        address,
        boxId,
        transactionId,
        headerId,
        ergoTree,
        ergoTreeTemplateHash
      }),
      spent,
      tokenId,
      skip,
      take
    });
  }
}
