import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { InputEntity } from "../../entities";
import { Input } from "../objects";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "../../utils";

@Resolver(Input)
export class InputResolver {
  @Query(() => [Input])
  async inputs(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: MAX_TAKE }) take: number,
    @Arg("transactionId", () => String, { nullable: true }) transactionId: string | undefined,
    @Arg("boxId", () => String, { nullable: true }) boxId: string | undefined,
    @Arg("headerId", () => String, { nullable: true }) headerId: string | undefined,
    @Ctx() context: { loader: GraphQLDatabaseLoader },
    @Info() info: GraphQLResolveInfo
  ) {
    const where = removeUndefined({
      transactionId,
      boxId,
      headerId
    });

    return await context.loader
      .loadEntity(InputEntity, "input")
      .info(info)
      .ejectQueryBuilder((query) => query.where(where).skip(skip).take(take))
      .loadMany();
  }
}
