import "dotenv/config";
import "reflect-metadata";

import { ApolloServer } from "apollo-server";
import { BaseRedisCache } from "apollo-server-cache-redis";
import {
  ApolloServerPluginCacheControl,
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import { GraphQLSchema } from "graphql";
import depthLimit from "graphql-depth-limit";
import { blockWatcher } from "./block-watcher";
import { redisClient } from "./caching";
import { DEFAULT_MAX_QUERY_DEPTH, MAX_CACHE_AGE } from "./consts";
import { DatabaseContext } from "./context/database-context";
import { initializeDataSource } from "./data-source";
import { generateSchema } from "./graphql/schema";
import { nodeService } from "./services";

const { TS_NODE_DEV, MAX_QUERY_DEPTH } = process.env;

(async () => {
  const [dataSource, schema] = await Promise.all([initializeDataSource(), generateSchema()]);
  const dataContext = new DatabaseContext(dataSource);

  nodeService.checkUrl();
  startBlockWatcher(dataContext);
  await startServer(schema, dataContext);
})();

async function startServer(schema: GraphQLSchema, dataContext: DatabaseContext) {
  const server = new ApolloServer({
    csrfPrevention: true,
    schema,
    introspection: true,
    context: { repository: dataContext },
    plugins: [
      ApolloServerPluginCacheControl({
        defaultMaxAge: MAX_CACHE_AGE,
        calculateHttpHeaders: true
      }),
      responseCachePlugin({
        cache: new BaseRedisCache({ client: redisClient })
      }),
      ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    validationRules: [
      depthLimit(
        MAX_QUERY_DEPTH ? parseInt(MAX_QUERY_DEPTH, 10) : DEFAULT_MAX_QUERY_DEPTH,
        undefined,
        (depths) => {
          if (TS_NODE_DEV === "true") {
            console.log("Query depths:", depths);
          }
        }
      )
    ]
  });

  const { url } = await server.listen({ port: 3000 });
  console.log(`🚀 Server ready at ${url}`);
}

async function startBlockWatcher(dataContext: DatabaseContext) {
  blockWatcher.start(dataContext.headers).onNewBlock(() => redisClient.flushdb());

  console.log("🚀 Block watcher started");
}
