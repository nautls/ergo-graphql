import { Field, ObjectType } from "type-graphql";
import { IBox } from "../interfaces/box-interface";
import { UnconfirmedTransaction } from "./unconfirmed-transaction";
import { UnconfirmedAsset } from "./unconfirmed-asset";
import { orderBy } from "lodash";

@ObjectType({ implements: IBox, simpleResolvers: true })
export class UnconfirmedBox extends IBox {
  @Field(() => UnconfirmedTransaction)
  transaction!: UnconfirmedTransaction;

  assets!: UnconfirmedAsset[];
  @Field(() => [UnconfirmedAsset], { name: "assets" })
  assetsResolver() {
    return orderBy(this.assets, (asset) => asset.index);
  }

  @Field(() => Boolean)
  beingSpent!: boolean;
}
