import { Field, ObjectType } from "type-graphql";
import { Box } from "./box";
import { DataInput } from "./data-input";
import { Input } from "./input";

@ObjectType({ simpleResolvers: true })
export class Transaction {
  @Field()
  transactionId!: string;

  @Field()
  blockId!: string;

  @Field()
  inclusionHeight!: number;

  @Field()
  coinbase!: boolean;

  @Field()
  timestamp!: bigint;

  @Field()
  size!: number;

  @Field()
  index!: number;

  @Field()
  globalIndex!: number;

  @Field()
  mainChain!: boolean;

  @Field(() => [Input])
  inputs!: Input[];

  @Field(() => [DataInput])
  dataInputs!: DataInput[];

  @Field(() => [Box])
  outputs!: Box[];
}
