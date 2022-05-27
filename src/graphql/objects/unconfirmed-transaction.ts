import { ObjectType, Field } from "type-graphql";
import { ITransaction } from "../interfaces/transaction-interface";
import { UnconfirmedBox } from "./unconfirmed-box";
import { UnconfirmedInput } from "./unconfirmed-input";

@ObjectType({ implements: ITransaction, simpleResolvers: true })
export class UnconfirmedTransaction extends ITransaction {
  timestamp!: bigint;

  @Field(() => [UnconfirmedInput])
  inputs!: UnconfirmedInput[];

  // dataInputs

  @Field(() => [UnconfirmedBox])
  outputs!: UnconfirmedBox[];
}
