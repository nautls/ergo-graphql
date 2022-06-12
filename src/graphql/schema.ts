import { join } from "path";
import { buildSchema, Int } from "type-graphql";
import { BigIntScalar } from "./scalars";
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
  EpochsResolver,
  ErgoTransactionResolver
} from "./resolvers";

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
      EpochsResolver,
      ErgoTransactionResolver
    ],
    scalarsMap: [
      { type: Number, scalar: Int },
      { type: BigInt, scalar: BigIntScalar }
    ]
  });
  console.log("✅ GraphQL schema generated");

  return schema;
}
