import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { TransactionEntity } from "../../entities";
import { Transaction } from "../objects/transaction";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "../../utils";

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
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    const where = removeUndefined({ headerId, inclusionHeight });

    return await context.loader
      .loadEntity(TransactionEntity, "transaction")
      .info(info)
      .ejectQueryBuilder((query) => {
        query = query.where(where);

        if (fromHeight)
          query = query.andWhere("transaction.inclusionHeight > :fromHeight", { fromHeight });
        if (toHeight)
          query = query.andWhere("transaction.inclusionHeight < :toHeight", { toHeight });

        return query.skip(skip).take(take);
      })
      .loadMany();
  }
}
