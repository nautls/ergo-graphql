import { Field, ObjectType } from "type-graphql";
import { JSONScalar } from "../scalars";
import { Box } from "./box";
import { Transaction } from "./transaction";

@ObjectType({ simpleResolvers: true })
export class Input {
  @Field()
  boxId!: string;

  @Field(() => Box)
  box!: Box;

  @Field()
  transactionId!: string;

  @Field(() => Transaction)
  transaction!: Transaction;

  @Field()
  headerId!: string;

  @Field({ nullable: true })
  proofBytes?: string;

  @Field(() => JSONScalar)
  extension!: object;

  @Field()
  index!: number;

  @Field()
  mainChain!: boolean;
}
