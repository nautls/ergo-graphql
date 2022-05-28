import { GraphQLResolveInfo } from "graphql";
import { Arg, Ctx, FieldResolver, Info, Int, Query, Resolver } from "type-graphql";
import { GraphQLContextWithArgs } from "../context-type";
import { Address } from "../objects/address";
import { isFieldSelected } from "./utils";

type ContextArgs = {
  address: string;
  atHeight?: number;
};

@Resolver(Address)
export class AddressResolver {
  @Query(() => Address)
  async addresses(
    @Arg("address", () => String, { nullable: false }) address: string,
    @Arg("atHeight", () => Int, { nullable: true }) atHeight: number,
    @Ctx() context: GraphQLContextWithArgs<ContextArgs>
  ) {
    context.args = { address, atHeight };
    return {};
  }

  @FieldResolver()
  async balance(
    @Ctx() context: GraphQLContextWithArgs<ContextArgs>,
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.repository.boxes.sum({
      where: { address: context.args.address, maxHeight: context.args.atHeight },
      include: {
        nanoErgs: isFieldSelected(info, "nanoErgs"),
        assets: isFieldSelected(info, "assets")
      }
    });
  }

  @FieldResolver()
  async transactionsCount(@Ctx() context: GraphQLContextWithArgs<ContextArgs>) {
    return await context.repository.transactions.countBy({
      where: {
        address: context.args.address,
        maxHeight: context.args.atHeight
      }
    });
  }
}
