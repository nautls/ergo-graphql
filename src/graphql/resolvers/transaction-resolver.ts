import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Int, Query, Resolver } from "type-graphql";
import { Transaction } from "../objects/transaction";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";
import { ArrayMaxSize } from "class-validator";

@ArgsType()
class TransactionArguments {
  /** @deprecated */
  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(20)
  transactionIds?: string[];

  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => Int, { nullable: true })
  inclusionHeight?: number;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => Int, { nullable: true })
  minHeight?: number;

  @Field(() => Int, { nullable: true })
  maxHeight?: number;
}

@Resolver(Transaction)
export class TransactionResolver {
  @Query(() => [Transaction])
  async transactions(
    @Args({ validate: true })
    {
      transactionId,
      transactionIds,
      headerId,
      inclusionHeight,
      address,
      minHeight,
      maxHeight
    }: TransactionArguments,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.repository.transactions.find({
      resolverInfo: info,
      where: removeUndefined({
        transactionId,
        headerId,
        inclusionHeight
      }),
      transactionIds,
      address,
      minHeight,
      maxHeight,
      skip,
      take
    });
  }
}
