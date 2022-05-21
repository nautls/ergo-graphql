import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP } from "../../consts";
import { HeaderEntity } from "../../entities";
import { Header } from "../objects";
import { TakeAmountScalar } from "../scalars";

@Resolver(Header)
export class HeaderResolver {
  @Query(() => [Header])
  async blockHeaders(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: 10 }) take: number,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.loader
      .loadEntity(HeaderEntity, "header")
      .info(info)
      .ejectQueryBuilder((query) => {
        return query.skip(skip).take(take);
      })
      .loadMany();
  }
}
