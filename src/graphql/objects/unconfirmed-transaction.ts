import { ObjectType, Field } from "type-graphql";
import { ITransaction } from "../interfaces/transaction-interface";
import { UnconfirmedBox } from "./unconfirmed-box";

@ObjectType({ implements: ITransaction, simpleResolvers: true })
export class UnconfirmedTransaction extends ITransaction {
  timestamp!: bigint;

  // inputs
  // dataInputs

  @Field(() => [UnconfirmedBox])
  outputs!: UnconfirmedBox[];
}
