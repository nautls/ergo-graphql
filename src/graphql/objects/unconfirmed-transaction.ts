import { ObjectType, Field } from "type-graphql";
import { ITransaction } from "../interfaces/transaction-interface";
import { UnconfirmedBox } from "./unconfirmed-box";
import { UnconfirmedInput } from "./unconfirmed-input";
import { UnconfirmedDataInput } from "./unconfirmed-data-input";

@ObjectType({ implements: ITransaction, simpleResolvers: true })
export class UnconfirmedTransaction extends ITransaction {
  timestamp!: bigint;

  @Field(() => [UnconfirmedInput])
  inputs!: UnconfirmedInput[];

  @Field(() => [UnconfirmedDataInput])
  dataInputs!: UnconfirmedDataInput[];

  @Field(() => [UnconfirmedBox])
  outputs!: UnconfirmedBox[];
}
