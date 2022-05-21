import { Field, ObjectType } from "type-graphql";
import { JSONScalar } from "../scalars";

@ObjectType({ simpleResolvers: true })
export class Extension {
  @Field()
  headerId!: string;

  @Field()
  digest!: string;

  @Field(() => JSONScalar)
  fields!: object;
}
