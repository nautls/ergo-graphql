import { Field, ObjectType } from "type-graphql";
import { Box } from "./box";
import { Transaction } from "./transaction";
import { IDataInput } from "../interfaces/data-input-interface";

@ObjectType({ implements: IDataInput , simpleResolvers: true })
export class DataInput extends IDataInput {
  @Field(() => Box)
  box!: Box;

  @Field(() => Transaction)
  transaction!: Transaction;

  @Field()
  headerId!: string;

  @Field()
  mainChain!: boolean;
}
