import { Field, ObjectType } from "type-graphql";
import { Registers } from "../../entities";
import { JSONScalar } from "../scalars";
import { Asset } from "./asset";
import { Input } from "./input";
import { Transaction } from "./transaction";

@ObjectType({ simpleResolvers: true })
export class Box {
  @Field()
  boxId!: string;

  @Field()
  transactionId!: string;

  @Field(() => Transaction)
  transaction!: Transaction;

  @Field()
  headerId!: string;

  @Field()
  value!: bigint;

  @Field()
  creationHeight!: number;

  @Field()
  settlementHeight!: number;

  @Field()
  index!: number;

  @Field()
  globalIndex!: number;

  @Field()
  ergoTree!: string;

  @Field()
  address!: string;

  @Field(() => [Asset])
  assets!: Asset[];

  @Field(() => JSONScalar)
  additionalRegisters!: Registers;

  @Field()
  mainChain!: boolean;

  @Field(() => Input, { nullable: true })
  spentBy?: Input;
}
