import { Field, InputType } from "type-graphql";
import { Registers } from "./registres";

@InputType("TokenMintingBox")
export class TokenMintingBox {
  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  ergoTree?: string;

  @Field(() => Registers, { nullable: true })
  additionalRegisters?: Registers;
}
