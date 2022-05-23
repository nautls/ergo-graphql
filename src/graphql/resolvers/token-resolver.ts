import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { TokenEntity } from "../../entities";
import { Token } from "../objects";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "./utils";

@Resolver(Token)
export class TokenResolver {
  @Query(() => [Token])
  async tokens(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: MAX_TAKE }) take: number,
    @Arg("boxId", () => String, { nullable: true }) boxId: string | undefined,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    const where = removeUndefined({ boxId });

    return await context.loader
      .loadEntity(TokenEntity, "token")
      .info(info)
      .ejectQueryBuilder((query) => query.where(where).skip(skip).take(take))
      .loadMany();
  }
}
