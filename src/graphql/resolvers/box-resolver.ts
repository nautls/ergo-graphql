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
    @Arg("address", () => String, { nullable: true }) address: string | undefined,
    @Arg("boxId", () => String, { nullable: true }) boxId: string | undefined,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    let where = {};
    if (address) {
      where = { address };
    }
    if (boxId) {
      where = { boxId, ...where };
    }

    return await context.loader
      .loadEntity(BoxEntity, "box")
      .info(info)
      .ejectQueryBuilder((query) => {
        return query.where(where).skip(skip).take(take);
      })
      .loadMany();
  }
}
