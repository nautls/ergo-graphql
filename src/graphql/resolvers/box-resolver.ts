import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, Info, Query, Resolver } from "type-graphql";
import { DEFAULT_SKIP, MAX_TAKE } from "../../consts";
import { Box } from "../objects";
import { TakeAmountScalar } from "../scalars";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";

@Resolver(Box)
export class BoxResolver {
  @Query(() => [Box])
  async boxes(
    @Arg("skip", { defaultValue: DEFAULT_SKIP }) skip: number,
    @Arg("take", () => TakeAmountScalar, { defaultValue: MAX_TAKE }) take: number,
    @Arg("address", () => String, { nullable: true }) address: string | undefined,
    @Arg("boxId", () => String, { nullable: true }) boxId: string | undefined,
    @Arg("transactionId", () => String, { nullable: true }) transactionId: string | undefined,
    @Arg("headerId", () => String, { nullable: true }) headerId: string | undefined,
    @Arg("ergoTree", () => String, { nullable: true }) ergoTree: string | undefined,
    @Arg("ergoTreeTemplateHash", () => String, { nullable: true })
    ergoTreeTemplateHash: string | undefined,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.boxes.find({
      resolverInfo: info,
      where: removeUndefined({
        address,
        boxId,
        transactionId,
        headerId,
        ergoTree,
        ergoTreeTemplateHash
      }),
      skip,
      take
    });
  }
}
