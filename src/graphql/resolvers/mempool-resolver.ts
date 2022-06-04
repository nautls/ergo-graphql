import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, FieldResolver, Info, Query, Resolver } from "type-graphql";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { Mempool } from "../objects";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class UnconfirmedBoxArguments {
  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  ergoTreeTemplateHash?: string;
}

@Resolver(Mempool)
export class MempoolResolver {
  @Query(() => Mempool)
  async mempool(@Info() info: GraphQLResolveInfo) {
    info.cacheControl.setCacheHint({ maxAge: 0 });
    return {};
  }

  @FieldResolver()
  async size(@Ctx() context: GraphQLContext) {
    return await context.repository.unconfirmedTransactions.sum({ by: "size" });
  }

  @FieldResolver()
  async transactionsCount(@Ctx() context: GraphQLContext) {
    return await context.repository.unconfirmedTransactions.count();
  }

  @FieldResolver()
  async transactions(
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.unconfirmedTransactions.find({
      resolverInfo: info,
      skip,
      take
    });
  }

  @FieldResolver()
  async boxes(
    @Args() { boxId, transactionId, address, ergoTreeTemplateHash }: UnconfirmedBoxArguments,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.unconfirmedBoxes.find({
      resolverInfo: info,
      where: removeUndefined({ boxId, transactionId, address, ergoTreeTemplateHash }),
      skip,
      take
    });
  }

}
