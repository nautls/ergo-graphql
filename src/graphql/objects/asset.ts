import { Field, ObjectType } from "type-graphql";
import { Token } from "./token";
import { Box } from "./box";
import { IAsset } from "../interfaces/asset-interface";

@ObjectType({ implements: IAsset , simpleResolvers: true })
export class Asset extends IAsset {
  @Field()
  headerId!: string;

  @Field(() => Token)
  token!: Token;

  @Field(() => Box)
  box!: Box;
}
