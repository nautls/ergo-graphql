import { Field, ObjectType } from "type-graphql";
import { IBox } from "../interfaces/box-interface";
import { UnconfirmedTransaction } from "./unconfirmed-transaction";

@ObjectType({ implements: IBox, simpleResolvers: true })
export class UnconfirmedBox extends IBox {
  @Field(() => UnconfirmedTransaction)
  transaction!: UnconfirmedTransaction;

  //TODO: assets
}
