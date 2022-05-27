import { Field, ObjectType } from "type-graphql";
import { IDataInput } from "../interfaces/data-input-interface";
import { UnconfirmedTransaction } from "./unconfirmed-transaction";

@ObjectType({ implements: IDataInput , simpleResolvers: true })
export class UnconfirmedDataInput extends IDataInput {
  @Field(() => UnconfirmedTransaction)
  transaction!: UnconfirmedTransaction;
}
