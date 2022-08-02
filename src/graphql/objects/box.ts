import { Field, ObjectType } from "type-graphql";
import { Asset } from "./asset";
import { Input } from "./input";
import { Transaction } from "./transaction";
import { IBox } from "../interfaces/box-interface";
import { orderBy } from "lodash";

@ObjectType({ implements: IBox, simpleResolvers: true })
export class Box extends IBox {
  @Field(() => Transaction)
  transaction!: Transaction;

  @Field()
  headerId!: string;

  @Field()
  settlementHeight!: number;

  @Field()
  globalIndex!: bigint;

  @Field()
  mainChain!: boolean;

  @Field(() => Input, { nullable: true })
  spentBy?: Input;

  assets!: Asset[];
  @Field(() => [Asset], { name: "assets" })
  assetsResolver() {
    return orderBy(this.assets, (asset) => asset.index);
  }

  @Field(() => Boolean)
  beingSpent!: boolean;
}
