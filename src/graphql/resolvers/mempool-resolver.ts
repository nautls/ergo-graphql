import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Args, Ctx, FieldResolver, Info, Query, Resolver } from "type-graphql";
import { appDataSource } from "../../data-source";
import { UnconfirmedTransactionEntity } from "../../entities";
import { Mempool } from "../objects";
import { PaginationArguments } from "./pagination-arguments";

@Resolver(Mempool)
export class MempoolResolver {
  @Query(() => Mempool)
  async mempool(@Info() info: GraphQLResolveInfo) {
    info.cacheControl.setCacheHint({ maxAge: 0 });
    return {};
  }

  @FieldResolver()
  async size() {
    const { size } = await appDataSource
      .getRepository(UnconfirmedTransactionEntity)
      .createQueryBuilder("utx")
      .select("SUM(utx.size)", "size")
      .getRawOne();

    return size;
  }

  @FieldResolver()
  async transactionsCount() {
    const { count } = await appDataSource
      .getRepository(UnconfirmedTransactionEntity)
      .createQueryBuilder("utx")
      .select("COUNT(utx.transactionId)", "count")
      .getRawOne();

    return count;
  }

  @FieldResolver()
  async transactions(
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.loader
      .loadEntity(UnconfirmedTransactionEntity, "utx")
      .info(info)
      .ejectQueryBuilder((query) => query.skip(skip).take(take))
      .loadMany();
  }
}
