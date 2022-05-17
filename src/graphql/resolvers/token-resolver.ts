import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { TokenEntity } from "../../entities";
import { Token } from "../objects";
import { TakeAmountScalar } from "../scalars";

@Resolver(Token)
export class TokenResolver {
  @Query(() => [Token])
  async tokens(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: MAX_TAKE }) take: number,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.loader
      .loadEntity(TokenEntity, "token")
      .info(info)
      .ejectQueryBuilder((query) => query.skip(skip).take(take))
      .loadMany();
  }
}
