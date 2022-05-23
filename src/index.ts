import "dotenv/config";
import "reflect-metadata";
import "./prototypes";

import { simpleEstimator, fieldExtensionsEstimator } from "graphql-query-complexity";
import { createComplexityPlugin } from "graphql-query-complexity-apollo-plugin";
import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { ApolloServer } from "apollo-server";
import { initializeDataSource } from "./data-source";
import { GraphQLSchema } from "graphql";
import { DataSource } from "typeorm";
import { generateSchema } from "./graphql/schema";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import { BaseRedisCache } from "apollo-server-cache-redis";
import { redisClient } from "./caching";
import { blockWatcher } from "./block-watcher";
import { ApolloServerPluginCacheControl } from "apollo-server-core";
import { MAX_CACHE_AGE, DEFAULT_MAX_QUERY_COMPLEXITY } from "./consts";

const { TS_NODE_DEV, MAX_QUERY_COMPLEXITY } = process.env;

(async () => {
  const [dataSource, schema] = await Promise.all([initializeDataSource(), generateSchema()]);
  startBlockWatcher();
  await startServer(schema, dataSource);
})();

async function startServer(schema: GraphQLSchema, dataSource: DataSource) {
  const server = new ApolloServer({
    csrfPrevention: true,
    schema,
    context: { loader: new GraphQLDatabaseLoader(dataSource) },
    plugins: [
      createComplexityPlugin({
        schema,
        estimators: [fieldExtensionsEstimator(), simpleEstimator({ defaultComplexity: 1 })],
        maximumComplexity: MAX_QUERY_COMPLEXITY
          ? Number.parseInt(MAX_QUERY_COMPLEXITY, 10)
          : DEFAULT_MAX_QUERY_COMPLEXITY,
        onComplete: (complexity: number) => {
          if (TS_NODE_DEV === "true" && complexity > 0) {
            console.log("Query complexity:", complexity);
          }
        }
      }),
      ApolloServerPluginCacheControl({ defaultMaxAge: MAX_CACHE_AGE, calculateHttpHeaders: true }),
      responseCachePlugin({ cache: new BaseRedisCache({ client: redisClient }) })
    ]
  });

  const { url } = await server.listen({ port: 3000 });
  console.log(`🚀 Server ready at ${url}`);
}

async function startBlockWatcher() {
  blockWatcher.start();
  blockWatcher.onNewBlock(() => redisClient.flushdb());

  console.log(`🚀 Block watcher started`);
}
