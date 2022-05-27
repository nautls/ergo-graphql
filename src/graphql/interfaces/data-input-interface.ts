import { Field, InterfaceType } from "type-graphql";

@InterfaceType()
export abstract class IDataInput {
  @Field()
  boxId!: string;

  @Field()
  transactionId!: string;

  @Field()
  index!: number;
}
