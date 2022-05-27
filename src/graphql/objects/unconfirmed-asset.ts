import { Field, ObjectType } from "type-graphql";
import { IAsset } from "../interfaces/asset-interface";
import { UnconfirmedBox } from "./unconfirmed-box";

@ObjectType({ implements: IAsset , simpleResolvers: true })
export class UnconfirmedAsset extends IAsset {
  @Field(() => UnconfirmedBox)
  box!: UnconfirmedBox;
}
