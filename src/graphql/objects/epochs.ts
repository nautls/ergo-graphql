import { Field, ObjectType } from "type-graphql";

@ObjectType({ simpleResolvers: true })
export class Epochs {
  @Field()
  id!: number;

  @Field()
  height!: number;

  @Field()
  storageFeeFactor!: number;
  
  @Field()
  minValuePerByte!: number;

  @Field()
  maxBlockSize!: number;

  @Field()
  maxBlockCost!: number;

  @Field()
  blockVersion!: number;

  @Field()
  tokenAccessCost!: number;

  @Field()
  inputCost!: number;

  @Field()
  dataInputCost!: number;

  @Field()
  outputCost!: number;
}
