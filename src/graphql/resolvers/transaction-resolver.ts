import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Args, ArgsType, Ctx, Field, Info, Int, Query, Resolver } from "type-graphql";
import { TransactionEntity } from "../../entities";
import { Transaction } from "../objects/transaction";
import { removeUndefined } from "../../utils";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class TransactionArguments {
  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => Int, { nullable: true })
  inclusionHeight?: number;

  @Field(() => Int, { nullable: true })
  fromHeight?: number;

  @Field(() => Int, { nullable: true })
  toHeight?: number;
}

@Resolver(Transaction)
export class TransactionResolver {
  @Query(() => [Transaction])
  async transactions(
    @Args() { headerId, inclusionHeight, fromHeight, toHeight }: TransactionArguments,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
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
