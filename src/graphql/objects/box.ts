import { Field, ObjectType } from "type-graphql";
import { Asset } from "./asset";
import { Input } from "./input";
import { Transaction } from "./transaction";
import { IBox } from "../interfaces/box-interface";

@ObjectType({ implements: IBox, simpleResolvers: true })
export class Box extends IBox {
  @Field(() => Transaction)
  transaction!: Transaction;

  @Field()
  headerId!: string;

  @Field()
  settlementHeight!: number;

  @Field()
  globalIndex!: number;

  @Field(() => [Asset])
  assets!: Asset[];

  @Field()
  mainChain!: boolean;

  @Field(() => Input, { nullable: true })
  spentBy?: Input;
}
