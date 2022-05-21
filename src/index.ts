import "dotenv/config";
import "reflect-metadata";
import "./prototypes";

import { getComplexity, simpleEstimator, fieldExtensionsEstimator } from "graphql-query-complexity";
import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { ApolloServer, ForbiddenError } from "apollo-server";
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
      {
        requestDidStart: () => ({
          didResolveOperation({ request, document }) {
            const complexity = getComplexity({
              schema,
              operationName: request.operationName,
              query: document,
              variables: request.variables,
              estimators: [
                fieldExtensionsEstimator(),
                simpleEstimator({ defaultComplexity: 1 }),
              ],
            });
            if(complexity > MAX_QUERY_COMPLEXITY_NUMBER) {
              throw new ForbiddenError('Query is too complex!');
            }
          },
        }),
      },
    ],
    csrfPrevention: true,
    context: { loader: new GraphQLDatabaseLoader(dataSource) }
  });
  const { url } = await server.listen({ port: 3000 });
  console.log(`🚀 Server ready at ${url}`);
}
