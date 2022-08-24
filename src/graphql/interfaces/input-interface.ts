import { Field, InterfaceType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";
import { Box } from "../objects";

@InterfaceType()
export abstract class IInput {
  @Field()
  boxId!: string;

  @Field()
  transactionId!: string;

  @Field({ nullable: true })
  proofBytes?: string;

  @Field(() => Box, { nullable: true })
  box?: Box;

  @Field(() => GraphQLJSONObject)
  extension!: object;

  @Field()
  index!: number;
}
