import "dotenv/config";
import "reflect-metadata";
import "./prototypes";

import { ApolloServer } from "apollo-server";
import { appDataSource } from "./data-source";
import { buildSchema, Int } from "type-graphql";
import { BoxObjectResolver } from "./graphql";
import { GraphQLSchema } from "graphql";
import { BigIntScalar } from "./graphql/scalars";
import { join } from "path";
import { DataSource } from "typeorm";
import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";

(async () => {
  const [dataSource, schema] = await Promise.all([
    initializeDataSource(),
    generateSchema()
  ]);

  await startServer(schema, dataSource);
})();

async function generateSchema() {
  const schema = await buildSchema({
    resolvers: [BoxObjectResolver],
    emitSchemaFile: join(process.cwd(), "src/graphql/schema.graphql"),
    dateScalarMode: "timestamp",
    scalarsMap: [
      { type: Number, scalar: Int },
      { type: BigInt, scalar: BigIntScalar }
    ]
  });
  console.log("✅ GraphQL schema generated");

  return schema;
}

async function startServer(schema: GraphQLSchema, dataSource: DataSource) {
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    context: { loader: new GraphQLDatabaseLoader(dataSource) }
  });
  const { url } = await server.listen({ port: 3000 });
  console.log(`🚀 Server ready at ${url}`);
}

async function initializeDataSource() {
  const connection = await appDataSource.initialize();
  console.log("✅ Data source connected");
  return connection;
}
