import { Arg, Field, ObjectType } from "type-graphql";
import { AddressAssetBalance } from "./address-asset-balance";

@ObjectType({ simpleResolvers: true })
export class AddressBalance {
  @Field()
  nanoErgs!: bigint;

  @Field(() => [AddressAssetBalance], { name: "assets" })
  assetsResolver(
    @Arg("tokenId", () => String, { nullable: true }) tokenId: string
  ): AddressAssetBalance[] {
    if (!tokenId) {
      return this.assets;
    }

    return this.assets.filter((x) => x.tokenId === tokenId);
  }

  assets!: AddressAssetBalance[];
}
