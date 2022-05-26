import { ObjectType } from "type-graphql";
import { ITransaction } from "../interfaces/transaction-interface";

@ObjectType({ implements: ITransaction, simpleResolvers: true })
export class UnconfirmedTransaction extends ITransaction {
  timestamp!: bigint;

  // inputs
  // dataInputs
  // outputs
}
