import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { DataInput } from "../objects/data-input";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";

@Resolver(DataInput)
export class DataInputResolver {
  @Query(() => [DataInput])
  async dataInputs(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: MAX_TAKE }) take: number,
    @Arg("transactionId", () => String, { nullable: true }) transactionId: string | undefined,
    @Arg("boxId", () => String, { nullable: true }) boxId: string | undefined,
    @Arg("headerId", () => String, { nullable: true }) headerId: string | undefined,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.dataInputs.find({
      resolverInfo: info,
      where: removeUndefined({
        transactionId,
        boxId,
        headerId
      }),
      skip,
      take
    });
  }
}
