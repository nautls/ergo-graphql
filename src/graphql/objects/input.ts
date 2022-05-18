import { Field, ObjectType } from "type-graphql";
import { JSONScalar } from "../scalars";
import { Box } from "./box";

@ObjectType({ simpleResolvers: true })
export class Input {
  @Field()
  boxId!: string;

  @Field(() => Box, { name: "box" })
  box!: Box;

  @Field()
  transactionId!: string;

  @Field()
  blockId!: string;

  @Field({ nullable: true })
  proofBytes?: string;

  @Field(() => JSONScalar)
  extension!: object;

  @Field()
  index!: number;

  @Field()
  mainChain!: boolean;
}
