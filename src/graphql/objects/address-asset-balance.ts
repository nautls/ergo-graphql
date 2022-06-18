import { Field, ObjectType } from "type-graphql";

@ObjectType({ simpleResolvers: true })
export class AddressAssetBalance {
  @Field()
  amount!: bigint;

  @Field()
  tokenId!: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  decimals?: number;
}
