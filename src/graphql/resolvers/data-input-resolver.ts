import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Query, Resolver } from "type-graphql";
import { DataInput } from "../objects/data-input";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class DataInputsQueryArgs {
  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  headerId?: string;
}

@Resolver(DataInput)
export class DataInputResolver {
  @Query(() => [DataInput])
  async dataInputs(
    @Args() { transactionId, boxId, headerId }: DataInputsQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.dataInputs.find({
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
