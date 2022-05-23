import { RedisClient } from "apollo-server-cache-redis";
import Redis from "ioredis";
import { removeUndefined } from "./utils";

const { REDIS_HOST, REDIS_PORT, REDIS_USER_NAME, REDIS_USER_PWD } = process.env;

export const redisClient = new Redis(
  removeUndefined({
    host: REDIS_HOST || "localhost",
    port: REDIS_PORT ? Number.parseInt(REDIS_PORT, 10) : 6379,
    username: REDIS_USER_NAME,
    password: REDIS_USER_PWD,
    name: "ergo-graphql"
  })
) as RedisClient;
