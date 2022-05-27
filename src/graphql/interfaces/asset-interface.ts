import { Field, InterfaceType } from "type-graphql";

@InterfaceType()
export abstract class IAsset {
  @Field()
  tokenId!: string;

  @Field()
  boxId!: string;

  @Field()
  index!: number;

  @Field()
  value!: bigint;
}
