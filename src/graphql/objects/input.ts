import { Field, ObjectType } from "type-graphql";
import { Box } from "./box";
import { Transaction } from "./transaction";
import { IInput } from "../interfaces/input-interface";

@ObjectType({ implements: IInput , simpleResolvers: true })
export class Input extends IInput {
  @Field(() => Box)
  box!: Box;

  @Field(() => Transaction)
  transaction!: Transaction;

  @Field()
  headerId!: string;

  @Field()
  mainChain!: boolean;
}
