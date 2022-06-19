import { join } from "path";
import { buildSchema, Int } from "type-graphql";
import {
  BoxResolver,
  TokenResolver,
  InputResolver,
  TransactionResolver,
  DataInputResolver,
  HeaderResolver,
  AddressResolver,
  MempoolResolver,
  BlockResolver,
  EpochsResolver
} from "./resolvers";
import { GraphQLString } from "graphql";

export async function generateSchema() {
  const schema = await buildSchema({
    emitSchemaFile: join(process.cwd(), "src/graphql/schema.graphql"),
    validate: false,
    resolvers: [
      BoxResolver,
      TokenResolver,
      InputResolver,
      TransactionResolver,
      DataInputResolver,
      HeaderResolver,
      AddressResolver,
      MempoolResolver,
      BlockResolver,
      EpochsResolver
    ],
    scalarsMap: [
      { type: Number, scalar: Int },
      { type: BigInt, scalar: GraphQLString }
    ]
  });
  console.log("✅ GraphQL schema generated");

  return schema;
}
