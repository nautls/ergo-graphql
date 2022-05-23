import { RedisClient } from "apollo-server-cache-redis";
import Redis from "ioredis";

export const redisClient = new Redis({ host: "localhost", name: "ergo-graphql" }) as RedisClient;
