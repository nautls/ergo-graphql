import { Field, InputType } from "type-graphql";
import { Registers } from "../../entities";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
export class AssetInput {
  @Field()
  tokenId!: string;

  @Field()
  amount!: string;
}

@InputType("TransactionOutput")
export class TransactionOutput {
  @Field({ nullable: true })
  boxId?: string;

  @Field()
  value!: string;

  @Field()
  ergoTree!: string;

  @Field()
  creationHeight!: number;

  @Field(() => [AssetInput], { nullable: true })
  assets?: [AssetInput];

  @Field(() => GraphQLJSONObject)
  additionalRegisters!: Registers<string>;

  @Field({ nullable: true })
  transactionId?: string;

  @Field({ nullable: true })
  index?: number;
}
