import { Field, InputType } from "type-graphql";
import { JSONScalar } from "../scalars";

@InputType()
class SpendingProofInput {
  @Field()
  proofBytes!: string;

  @Field(() => JSONScalar)
  extension!: object;
}

@InputType("TransactionInput")
export class TransactionInput {
  @Field()
  boxId!: string;

  @Field(() => SpendingProofInput)
  spendingProof!: SpendingProofInput;
}
