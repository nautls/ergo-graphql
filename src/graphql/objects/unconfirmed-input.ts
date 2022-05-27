import { Field, ObjectType } from "type-graphql";
import { IInput } from "../interfaces/input-interface";
import { UnconfirmedTransaction } from "./unconfirmed-transaction";

@ObjectType({ implements: IInput , simpleResolvers: true })
export class UnconfirmedInput extends IInput {
  @Field(() => UnconfirmedTransaction)
  transaction!: UnconfirmedTransaction;
}
