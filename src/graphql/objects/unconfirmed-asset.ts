import { Field, ObjectType } from "type-graphql";
import { IAsset } from "../interfaces/asset-interface";
import { Token } from "./token";

@ObjectType({ implements: IAsset, simpleResolvers: true })
export class UnconfirmedAsset extends IAsset {
  @Field(() => Token)
  token!: Token;
}
