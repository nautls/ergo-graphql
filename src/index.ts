import "dotenv/config";
import "reflect-metadata";

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
import { MAX_CACHE_AGE, DEFAULT_MAX_QUERY_DEPTH } from "./consts";
import { DatabaseContext } from "./context/database-context";
import depthLimit from "graphql-depth-limit";

const { TS_NODE_DEV, MAX_QUERY_DEPTH } = process.env;

(async () => {
  const [dataSource, schema] = await Promise.all([initializeDataSource(), generateSchema()]);
  startBlockWatcher();
  await startServer(schema, dataSource);
})();

async function startServer(schema: GraphQLSchema, dataSource: DataSource) {
  const server = new ApolloServer({
    csrfPrevention: true,
    schema,
    introspection: true,
    context: { repository: new DatabaseContext(dataSource) },
    plugins: [
      ApolloServerPluginCacheControl({ defaultMaxAge: MAX_CACHE_AGE, calculateHttpHeaders: true }),
      responseCachePlugin({ cache: new BaseRedisCache({ client: redisClient }) })
    ],
    validationRules: [
      depthLimit(
        MAX_QUERY_DEPTH ? parseInt(MAX_QUERY_DEPTH, 10) : DEFAULT_MAX_QUERY_DEPTH,
        {},
        (depths) => {
          if (TS_NODE_DEV === "true") {
            console.log("Query Depths:", depths);
          }
        }
      )
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
