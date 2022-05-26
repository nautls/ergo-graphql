import { Field, InterfaceType } from "type-graphql";
import { BaseEntity } from "typeorm";

@InterfaceType()
export abstract class TransactionEntityBase extends BaseEntity {
  @Field()
  transactionId!: string;

  @Field()
  size!: number;
}
