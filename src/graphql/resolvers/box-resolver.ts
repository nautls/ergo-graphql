import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { BoxEntity } from "../../entities";
import { Box } from "../objects";
import { TakeAmountScalar } from "../scalars";

@Resolver(Box)
export class BoxResolver {
  @Query(() => [Box])
  async boxes(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: MAX_TAKE }) take: number,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.loader
      .loadEntity(BoxEntity, "box")
      .info(info)
      .ejectQueryBuilder((query) => query.skip(skip).take(take))
      .loadMany();
  }
}
