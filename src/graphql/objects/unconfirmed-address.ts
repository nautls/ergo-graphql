import { Field, ObjectType } from "type-graphql";
import { AddressBalance } from "./address-balance";

@ObjectType({ simpleResolvers: true })
export class UnconfirmedAddress {
  @Field()
  address!: string;

  @Field(() => AddressBalance)
  balance!: AddressBalance;
}
