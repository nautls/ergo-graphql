import { Field, ObjectType } from "type-graphql";
import { Box } from "./box";
import { Transaction } from "./transaction";

@ObjectType({ simpleResolvers: true })
export class DataInput {
  @Field()
  boxId!: string;

  @Field(() => Box)
  box!: Box;

  @Field()
  transactionId!: string;

  @Field(() => Transaction)
  transaction!: Transaction;

  @Field()
  blockId!: string;

  @Field()
  index!: number;

  @Field()
  mainChain!: boolean;
}
