import { Field, ObjectType } from "type-graphql";
import { Epochs } from ".";

@ObjectType({ simpleResolvers: true })
export class State {
  @Field()
  blockId?: string;

  @Field()
  height?: number;

  @Field()
  maxBoxGlobalIndex?: bigint;

  @Field()
  maxTransactionGlobalIndex?: bigint;

  @Field(() => Epochs)
  params?: Epochs;
}
