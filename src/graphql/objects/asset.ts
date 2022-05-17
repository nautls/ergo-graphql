import { Field, ObjectType } from "type-graphql";
import { Token } from "./token";

@ObjectType({ simpleResolvers: true })
export class Asset {
  @Field()
  tokenId!: string;

  @Field()
  blockId!: string;

  @Field()
  value!: bigint;

  @Field(() => Token)
  token!: Token;
}
