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
  Resolver,
  Root
} from "type-graphql";
import { ArrayMaxSize } from "class-validator";

@ArgsType()
class AddressesQueryArgs {
  @Field(() => [String], { nullable: false })
  @ArrayMaxSize(20)
  addresses!: string[];

  @Field(() => Int, { nullable: true })
  atHeight?: number;
}

type ContextArgs = {
  height?: number;
};

@Resolver(Address)
export class AddressResolver {
  @Query(() => [Address])
  async addresses(
    @Args({ validate: true }) { addresses, atHeight }: AddressesQueryArgs,
    @Ctx() context: GraphQLContextWithArgs<ContextArgs>,
    @Info() info: GraphQLResolveInfo
  ) {
    context.args = { height: atHeight };

    const balances = isFieldSelected(info, "balance")
      ? await context.repository.boxes.sum({
          where: { addresses, maxHeight: atHeight },
          include: {
            nanoErgs: isFieldSelected(info, "balance.nanoErgs"),
            assets: isFieldSelected(info, "balance.assets")
          }
        })
      : [];

    return addresses.map((address) => {
      return {
        address,
        balance: balances.find((b) => b.address === address) || { nanoErgs: 0, assets: [] }
      };
    });
  }

  @FieldResolver()
  async transactionsCount(
    @Root() root: Address,
    @Ctx() context: GraphQLContextWithArgs<ContextArgs>
  ) {
    return await context.repository.transactions.count({
      where: {
        address: root.address,
        maxHeight: context.args.height
      }
    });
  }

  @FieldResolver()
  async used(@Root() root: Address, @Ctx() context: GraphQLContextWithArgs<ContextArgs>) {
    return await context.repository.boxes.getAddressBoxCount(root.address) > 0;
  }

  @FieldResolver()
  async boxesCount(@Root() root: Address, @Ctx() context: GraphQLContextWithArgs<ContextArgs>) {
    return await context.repository.boxes.getAddressBoxCount(root.address);
  }
}
