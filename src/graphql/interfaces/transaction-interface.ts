import { Field, InterfaceType } from "type-graphql";

// Interfaces should be declared as abstract classes in type-graphql.
// Ref: https://typegraphql.com/docs/interfaces.html#abstract-classes

@InterfaceType()
export abstract class ITransaction {
  @Field()
  transactionId!: string;

  @Field()
  size!: number;
}
