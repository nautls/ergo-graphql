/* eslint-disable @typescript-eslint/no-unused-vars */
import { orderBy } from "lodash";
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

  inputs!: Input[];
  @Field(() => [Input], { name: "inputs" })
  inputsResolver() {
    return orderBy(this.inputs, (input) => input.index);
  }

  dataInputs!: DataInput[];
  @Field(() => [DataInput], { name: "dataInputs" })
  dataInputsResolver() {
    return orderBy(this.dataInputs, (dataInput) => dataInput.index);
  }

  outputs!: Box[];
  @Field(() => [Box], { name: "outputs" })
  outputsResolver(
    @Arg("onlyRelevant", () => Boolean, {
      nullable: true,
      description: "Only includes outputs owned by `address` and the miner fee output"
    })
    onlyRelevant?: boolean
  ): Box[] {
    return orderBy(this.outputs, (output) => output.index);
  }
}
