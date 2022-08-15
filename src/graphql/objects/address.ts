import { Field, ObjectType } from "type-graphql";
import { AddressBalance } from "./address-balance";

@ObjectType({ simpleResolvers: true })
export class Address {
  @Field()
  address!: string;

  @Field(() => AddressBalance)
  balance!: AddressBalance;

  @Field()
  transactionsCount!: number;

  @Field()
  used!: boolean;
}
