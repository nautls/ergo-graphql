import "reflect-metadata";
import { DataSource } from "typeorm";
import * as entities from "./entities";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER_NAME, DB_USER_PWD, TS_NODE_DEV } = process.env;

export const appDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number.parseInt(DB_PORT, 10),
  database: DB_NAME,
  username: DB_USER_NAME,
  password: DB_USER_PWD,
  logging: TS_NODE_DEV === "true",
  synchronize: false,
  entities,
  subscribers: []
});

export async function initializeDataSource() {
  const connection = await appDataSource.initialize();
  console.log("✅ Data source connected");
  return connection;
}
