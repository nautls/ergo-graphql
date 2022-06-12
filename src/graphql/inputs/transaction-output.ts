import { Field, InputType, Int } from "type-graphql";
import { Registers } from "../../entities";
import { JSONScalar } from "../scalars";

@InputType()
export class AssetInput {
  @Field(() => String)
  tokenId!: string;

  @Field(() => Int)
  amount!: number;
}

@InputType("TransactionOutput")
export class TransactionOutput {
  @Field(() => String)
  boxId?: string;

  @Field(() => Int)
  value!: number;

  @Field(() => String)
  ergoTree!: string;

  @Field(() => Int)
  creationHeight!: number;

  @Field(() => AssetInput)
  assets?: AssetInput;

  @Field(() => JSONScalar)
  additionalRegisters!: Registers;

  @Field(() => String)
  transactionId?: string;

  @Field(() => Int)
  index?: number;
}
