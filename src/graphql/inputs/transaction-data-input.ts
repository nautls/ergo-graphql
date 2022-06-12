import { Field, InputType } from "type-graphql";

@InputType("TransactionDataInput")
export class TransactionDataInput {
  @Field()
  boxId!: string;
}
