import { Field, InputType } from "type-graphql";
import { JSONScalar } from "../scalars";

@InputType()
class SpendingProofInput {
  @Field(() => String)
  proofBytes!: string;

  @Field(() => JSONScalar)
  extension!: object;
}

@InputType("TransactionInput")
export class TransactionInput {
  @Field(() => String)
  boxId!: string;

  @Field(() => SpendingProofInput)
  spendingProof!: SpendingProofInput;
}
