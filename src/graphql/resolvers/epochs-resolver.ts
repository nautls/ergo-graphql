import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Int, Query, Resolver } from "type-graphql";
import { Epochs } from "../objects";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class EpochsArguments {
  @Field(() => Int, { nullable: true })
  id?: number;

  @Field(() => Int, { nullable: true })
  height?: number;
}

@Resolver(Epochs)
export class EpochsResolver {
  @Query(() => [Epochs])
  async epochs(
    @Args() { id, height }: EpochsArguments,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.repository.epochs.find({
      resolverInfo: info,
      where: removeUndefined({ id, height }),
      skip,
      take
    });
  }
}

