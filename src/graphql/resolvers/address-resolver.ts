import { GraphQLResolveInfo } from "graphql";
import { GraphQLContextWithArgs } from "../context-type";
import { Address } from "../objects/address";
import { isFieldSelected } from "./utils";
import {
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Info,
  Int,
  Query,
  Resolver
} from "type-graphql";

type ContextArgs = {
  address: string;
  atHeight?: number;
};

@ArgsType()
class AddressesQueryArgs {
  @Field(() => String, { nullable: false })
  address!: string;

  @Field(() => Int, { nullable: true })
  atHeight?: number;
}

@Resolver(Address)
export class AddressResolver {
  @Query(() => Address)
  async addresses(
    @Args() { address, atHeight }: AddressesQueryArgs,
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
    return await context.repository.transactions.count({
      where: {
        address: context.args.address,
        maxHeight: context.args.atHeight
      }
    });
  }
}
