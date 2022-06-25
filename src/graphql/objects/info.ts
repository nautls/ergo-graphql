import { Field, ObjectType } from "type-graphql";

@ObjectType({ simpleResolvers: true })
export class Info {
  @Field()
  version?: string;
}
