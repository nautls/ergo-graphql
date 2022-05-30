import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Int, Query, Resolver } from "type-graphql";
import { Transaction } from "../objects/transaction";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class TransactionArguments {
  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => Int, { nullable: true })
  inclusionHeight?: number;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => Int, { nullable: true })
  fromHeight?: number;

  @Field(() => Int, { nullable: true })
  toHeight?: number;
}

@Resolver(Transaction)
export class TransactionResolver {
  @Query(() => [Transaction])
  async transactions(
    @Args() { headerId, inclusionHeight, address, fromHeight, toHeight }: TransactionArguments,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.repository.transactions.find({
      resolverInfo: info,
      where: removeUndefined({ headerId, inclusionHeight }),
      address,
      fromHeight,
      toHeight,
      skip,
      take
    });
  }
}
