import { Field, InterfaceType } from "type-graphql";
import { Box } from "../objects";
import { JSONScalar } from "../scalars";

@InterfaceType()
export abstract class IInput {
  @Field()
  boxId!: string;

  @Field(() => Box)
  box!: Box;

  @Field()
  transactionId!: string;

  @Field({ nullable: true })
  proofBytes?: string;

  @Field(() => JSONScalar)
  extension!: object;

  @Field()
  index!: number;
}
