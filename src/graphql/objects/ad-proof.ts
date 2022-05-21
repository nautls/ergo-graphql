import { Field, ObjectType } from "type-graphql";

@ObjectType({ simpleResolvers: true })
export class AdProof {
  @Field()
  headerId!: string;

  @Field()
  proofBytes!: string;

  @Field()
  digest!: string;
}
