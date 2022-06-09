/* eslint-disable @typescript-eslint/no-unused-vars */
import { Arg, Field, ObjectType } from "type-graphql";
import { ITransaction } from "../interfaces/transaction-interface";
import { Box } from "./box";
import { DataInput } from "./data-input";
import { Input } from "./input";

@ObjectType({ implements: ITransaction, simpleResolvers: true })
export class Transaction extends ITransaction {
  @Field()
  headerId!: string;

  @Field()
  inclusionHeight!: number;

  @Field()
  coinbase!: boolean;

  @Field()
  timestamp!: bigint;

  @Field()
  index!: number;

  @Field()
  globalIndex!: bigint;

  @Field()
  mainChain!: boolean;

  @Field(() => [Input])
  inputs!: Input[];

  @Field(() => [DataInput])
  dataInputs!: DataInput[];

  @Field(() => [Box], { name: "outputs" })
  assetsResolver(
    @Arg("onlyRelevant", () => Boolean, {
      nullable: true,
      description: "Only includes outputs owned by `address` and the miner fee output"
    })
    onlyRelevant?: boolean
  ): Box[] {
    return this.outputs;
  }

  outputs!: Box[];
}
