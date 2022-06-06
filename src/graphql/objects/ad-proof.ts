import { Field, ObjectType } from "type-graphql";
import { Header } from "./header";

@ObjectType({ simpleResolvers: true })
export class AdProof {
  @Field()
  headerId!: string;

  @Field()
  proofBytes!: string;

  @Field()
  digest!: string;

  @Field(() => Header)
  header!: Header;
}
