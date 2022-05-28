import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Query, Resolver } from "type-graphql";
import { Input } from "../objects";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class InputsQueryArgs {
  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  headerId?: string;
}

@Resolver(Input)
export class InputResolver {
  @Query(() => [Input])
  async inputs(
    @Args() { transactionId, boxId, headerId }: InputsQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.inputs.find({
      resolverInfo: info,
      where: removeUndefined({
        transactionId,
        boxId,
        headerId
      }),
      skip,
      take
    });
  }
}
