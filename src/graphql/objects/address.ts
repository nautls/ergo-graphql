import { Arg, Field, ObjectType } from "type-graphql";

@ObjectType({ simpleResolvers: true })
class AddressBalanceAssets {
  @Field()
  amount!: bigint;

  @Field()
  tokenId!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  decimals?: number;
}

@ObjectType({ simpleResolvers: true })
export class AddressBalance {
  @Field()
  nanoErgs!: bigint;

  @Field(() => [AddressBalanceAssets], { name: "assets" })
  assetsResolver(
    @Arg("tokenId", () => String, { nullable: true }) tokenId: string
  ): AddressBalanceAssets[] {
    if (!tokenId) {
      return this.assets;
    }

    return this.assets.filter((x) => x.tokenId === tokenId);
  }

  assets!: AddressBalanceAssets[];
}

@ObjectType({ simpleResolvers: true })
export class Address {
  @Field()
  address!: string;

  @Field(() => AddressBalance)
  balance!: AddressBalance;

  @Field()
  transactionsCount!: number;
}
