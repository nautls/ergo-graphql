import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Int, Query, Resolver } from "type-graphql";
import { removeUndefined } from "../../utils";
import { Block } from "../objects/block";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class BlockQueryArgs extends PaginationArguments {
  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Int, { nullable: true })
  minHeight?: number;

  @Field(() => Int, { nullable: true })
  maxHeight?: number;

  @Field(() => Int, { defaultValue: 10 })
  take = 10;
}

@Resolver(Block)
export class BlockResolver {
  @Query(() => [Block])
  async blocks(
    @Args({ validate: true })
    { headerId, height, minHeight, maxHeight, skip, take }: BlockQueryArgs,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.blockInfo.find({
      resolverInfo: info,
      where: removeUndefined({ headerId, height }),
      minHeight,
      maxHeight,
      take,
      skip
    });
  }
}
