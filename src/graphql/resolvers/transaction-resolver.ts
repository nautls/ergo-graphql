import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { Transaction } from "../objects/transaction";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";

@Resolver(Transaction)
export class TransactionResolver {
  @Query(() => [Transaction])
  async transactions(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: MAX_TAKE }) take: number,
    @Arg("fromHeight", () => Number, { nullable: true }) fromHeight: number | undefined,
    @Arg("toHeight", () => Number, { nullable: true }) toHeight: number | undefined,
    @Arg("headerId", () => String, { nullable: true }) headerId: string | undefined,
    @Arg("inclusionHeight", () => Number, { nullable: true }) inclusionHeight: number | undefined,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.repository.transactions.find({
      resolverInfo: info,
      where: removeUndefined({ headerId, inclusionHeight }),
      take,
      skip,
      fromHeight,
      toHeight
    });
  }
}
