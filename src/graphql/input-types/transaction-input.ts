import { Field, InputType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@InputType()
class SpendingProofInput {
  @Field()
  proofBytes!: string;

  @Field(() => GraphQLJSONObject)
  extension!: object;
}

@InputType("TransactionInput")
export class TransactionInput {
  @Field()
  boxId!: string;

  @Field(() => SpendingProofInput)
  spendingProof!: SpendingProofInput;
}
