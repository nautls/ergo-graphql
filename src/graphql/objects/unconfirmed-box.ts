import { Field, ObjectType } from "type-graphql";
import { IBox } from "../interfaces/box-interface";
import { UnconfirmedTransaction } from "./unconfirmed-transaction";
import { UnconfirmedAsset } from "./unconfirmed-asset";

@ObjectType({ implements: IBox, simpleResolvers: true })
export class UnconfirmedBox extends IBox {
  @Field(() => UnconfirmedTransaction)
  transaction!: UnconfirmedTransaction;

  @Field(() => [UnconfirmedAsset])
  assets!: UnconfirmedAsset[];
}
