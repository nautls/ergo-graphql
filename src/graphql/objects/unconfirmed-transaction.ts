import { ObjectType, Field } from "type-graphql";
import { ITransaction } from "../interfaces/transaction-interface";
import { UnconfirmedBox } from "./unconfirmed-box";
import { UnconfirmedInput } from "./unconfirmed-input";
import { UnconfirmedDataInput } from "./unconfirmed-data-input";
import { orderBy } from "lodash";

@ObjectType({ implements: ITransaction, simpleResolvers: true })
export class UnconfirmedTransaction extends ITransaction {
  @Field()
  timestamp!: bigint;

  inputs!: UnconfirmedInput[];
  @Field(() => [UnconfirmedInput], { name: "inputs" })
  inputsResolver() {
    return orderBy(this.inputs, (input) => input.index);
  }

  dataInputs!: UnconfirmedDataInput[];
  @Field(() => [UnconfirmedDataInput], { name: "dataInputs" })
  dataInputsResolver() {
    return orderBy(this.dataInputs, (dataInput) => dataInput.index);
  }

  outputs!: UnconfirmedBox[];
  @Field(() => [UnconfirmedBox], { name: "outputs" })
  outputsResolver() {
    return orderBy(this.outputs, (output) => output.index);
  }
}
