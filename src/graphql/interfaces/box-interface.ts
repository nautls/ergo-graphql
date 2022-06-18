import { Field, InterfaceType } from "type-graphql";
import { Registers } from "../../entities";
import { GraphQLJSONObject } from "graphql-type-json";

@InterfaceType()
export abstract class IBox {
  @Field()
  boxId!: string;

  @Field()
  transactionId!: string;

  @Field()
  value!: bigint;

  @Field()
  creationHeight!: number;

  @Field()
  index!: number;

  @Field()
  ergoTree!: string;

  @Field()
  ergoTreeTemplateHash!: string;

  @Field()
  address!: string;

  @Field(() => GraphQLJSONObject)
  additionalRegisters!: Registers;
}
