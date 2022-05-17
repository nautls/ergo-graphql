import { Field, ObjectType } from "type-graphql";
import { Box } from "./box";

@ObjectType({ simpleResolvers: true })
export class Token {
  @Field()
  tokenId!: string;

  @Field()
  boxId!: string;

  @Field(() => Box)
  box!: Box;

  @Field()
  emissionAmount!: bigint;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  description?: string;

  @Field({ nullable: true })
  type?: string;

  @Field({ nullable: true })
  decimals?: number;
}
