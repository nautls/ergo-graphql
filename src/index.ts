import "dotenv/config";
import "reflect-metadata";
import "./prototypes";

import { simpleEstimator, fieldExtensionsEstimator } from "graphql-query-complexity";
import { createComplexityPlugin } from 'graphql-query-complexity-apollo-plugin';
import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { ApolloServer } from "apollo-server";
import { initializeDataSource } from "./data-source";
import { GraphQLSchema } from "graphql";
import { DataSource } from "typeorm";
import { generateSchema } from "./graphql/schema";

const MAX_QUERY_COMPLEXITY_NUMBER = Number.parseInt(process.env.MAX_QUERY_COMPLEXITY || "", 10) || 20;

(async () => {
  const [dataSource, schema] = await Promise.all([initializeDataSource(), generateSchema()]);
  await startServer(schema, dataSource);
})();

async function startServer(schema: GraphQLSchema, dataSource: DataSource) {
  const server = new ApolloServer({
    schema,
    plugins: [
      createComplexityPlugin({
        schema,
        estimators: [
          fieldExtensionsEstimator(),
          simpleEstimator({ defaultComplexity: 1 }),
        ],
        maximumComplexity: MAX_QUERY_COMPLEXITY_NUMBER,
        onComplete: (complexity) => {
          if(complexity > 0)
            console.log('Query Complexity:', complexity)
        },
      }),
    ],
    csrfPrevention: true,
    context: { loader: new GraphQLDatabaseLoader(dataSource) }
  });
  const { url } = await server.listen({ port: 3000 });
  console.log(`🚀 Server ready at ${url}`);
}
