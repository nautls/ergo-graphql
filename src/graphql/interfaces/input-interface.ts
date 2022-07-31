import { Field, InterfaceType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@InterfaceType()
export abstract class IInput {
  @Field()
  boxId!: string;

  @Field()
  transactionId!: string;

  @Field({ nullable: true })
  proofBytes?: string;

  @Field(() => GraphQLJSONObject)
  extension!: object;

  @Field()
  index!: number;
}
