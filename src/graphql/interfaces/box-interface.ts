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

  @Field(() => GraphQLJSONObject, { name: "additionalRegisters" })
  additionalRegistersResolver(): Registers {
    const keys = Object.keys(this.additionalRegisters);
    if (keys.length <= 1) {
      return this.additionalRegisters;
    }

    const orderedRegisters: Registers = {};
    for (const key of keys.sort()) {
      orderedRegisters[key as keyof Registers] = this.additionalRegisters[key as keyof Registers];
    }
    return orderedRegisters;
  }

  additionalRegisters!: Registers;
}
