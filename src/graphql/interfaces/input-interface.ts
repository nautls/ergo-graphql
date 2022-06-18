import { Field, InterfaceType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Box } from "../objects";

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

  @Field(() => GraphQLJSONObject)
  extension!: object;

  @Field()
  index!: number;
}
