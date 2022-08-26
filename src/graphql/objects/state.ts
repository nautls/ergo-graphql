import { Field, ObjectType } from "type-graphql";
import { Epochs } from ".";

@ObjectType({ simpleResolvers: true })
export class State {
  @Field()
  blockId?: string;

  @Field()
  height?: number;

  @Field()
  boxGlobalIndex?: bigint;

  @Field()
  transactionGlobalIndex?: bigint;

  @Field(() => Epochs)
  params?: Epochs;

  @Field()
  network!: string;

  @Field()
  difficulty?: bigint;
}
