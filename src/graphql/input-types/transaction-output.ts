import { Field, Float, InputType } from "type-graphql";
import { Registers } from "../../entities";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class AssetInput {
  @Field()
  tokenId!: string;

  @Field(() => Float)
  amount!: number;
}

@InputType("TransactionOutput")
export class TransactionOutput {
  @Field({ nullable: true })
  boxId?: string;

  @Field(() => Float)
  value!: number;

  @Field()
  ergoTree!: string;

  @Field()
  creationHeight!: number;

  @Field(() => [AssetInput], { nullable: true })
  assets?: [AssetInput];

  @Field(() => GraphQLJSONObject)
  additionalRegisters!: Registers;

  @Field({ nullable: true })
  transactionId?: string;

  @Field({ nullable: true })
  index?: number;
}
