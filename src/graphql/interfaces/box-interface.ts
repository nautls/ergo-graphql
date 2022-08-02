import { Field, InterfaceType } from "type-graphql";
import { Registers } from "../../entities";
import { GraphQLJSONObject } from "graphql-type-json";
import { ConfigureLoader } from "@mando75/typeorm-graphql-loader";
import { Register } from "../../entities/base-types/box-entity-base";

@InterfaceType()
export abstract class IBox {
  @Field()
  @ConfigureLoader({ required: true })
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
  additionalRegistersResolver(): Registers<string> {
    const keys = Object.keys(this.additionalRegisters);
    if (keys.length < 1) {
      return {};
    }

    const orderedRegisters: Registers<string> = {};
    for (const key of keys.sort()) {
      orderedRegisters[key as keyof Registers<string>] =
        this.additionalRegisters[key as keyof Registers<Register>]?.serializedValue;
    }
    return orderedRegisters;
  }

  additionalRegisters!: Registers<Register>;
}
