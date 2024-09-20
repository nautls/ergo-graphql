import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Int, Query, Resolver } from "type-graphql";
import { Header } from "../objects";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class BlockHeadersQueryArgs extends PaginationArguments {
  /** @deprecated */
  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => [String], { nullable: true })
  headerIds?: string[];

  @Field(() => String, { nullable: true })
  parentId?: string;

  @Field(() => Int, { nullable: true })
  height?: number;

  @Field(() => Int, { defaultValue: 10 })
  take = 10;
}

@Resolver(Header)
export class HeaderResolver {
  @Query(() => [Header])
  async blockHeaders(
    @Args({ validate: true }) { headerId, headerIds, parentId, height, skip, take }: BlockHeadersQueryArgs,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.headers.find({
      resolverInfo: info,
      where: removeUndefined({
        headerId,
        parentId,
        height
      }),
      headerIds,
      skip,
      take
    });
  }
}
