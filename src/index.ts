import "dotenv/config";
import "reflect-metadata";
import "./prototypes";

import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { ApolloServer } from "apollo-server";
import { initializeDataSource } from "./data-source";
import { GraphQLSchema } from "graphql";
import { DataSource } from "typeorm";
import { generateSchema } from "./graphql/schema";
import responseCachePlugin from "apollo-server-plugin-response-cache";
import { BaseRedisCache, RedisClient } from "apollo-server-cache-redis";
import Redis from "ioredis";

(async () => {
  const [dataSource, schema] = await Promise.all([initializeDataSource(), generateSchema()]);
  await startServer(schema, dataSource);
})();

async function startServer(schema: GraphQLSchema, dataSource: DataSource) {
  const server = new ApolloServer({
    schema,
    csrfPrevention: true,
    plugins: [
      responseCachePlugin({
        cache: new BaseRedisCache({
          client: new Redis({ host: "localhost" }) as RedisClient
        })
      })
    ],
    context: { loader: new GraphQLDatabaseLoader(dataSource) }
  });
  const { url } = await server.listen({ port: 3000 });
  console.log(`🚀 Server ready at ${url}`);
}
