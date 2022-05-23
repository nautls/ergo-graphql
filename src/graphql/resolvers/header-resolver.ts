import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP } from "../../consts";
import { HeaderEntity } from "../../entities";
import { Header } from "../objects";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined, setDefaultCacheHint } from "./utils";

@Resolver(Header)
export class HeaderResolver {
  @Query(() => [Header])
  async blockHeaders(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: 10 }) take: number,
    @Arg("parentId", () => String, { nullable: true }) parentId: string | undefined,
    @Arg("height", () => Number, { nullable: true }) height: number | undefined,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    setDefaultCacheHint(info);
    const where = removeUndefined({
      parentId,
      height
    });

    return await context.loader
      .loadEntity(HeaderEntity, "header")
      .info(info)
      .ejectQueryBuilder((query) => {
        return query.where(where).skip(skip).take(take);
      })
      .loadMany();
  }
}
