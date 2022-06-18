import { Field, ObjectType } from "type-graphql";
import { GraphQLJSONObject } from "graphql-type-json";

@ObjectType({ simpleResolvers: true })
export class Extension {
  @Field()
  headerId!: string;

  @Field()
  digest!: string;

  @Field(() => GraphQLJSONObject)
  fields!: object;
}
