import { DataSource } from "typeorm";
import * as entities from "./entities";

const { DB_HOST, DB_PORT, DB_NAME, DB_USER_NAME, DB_USER_PWD, DB_SSL, TS_NODE_DEV } = process.env;

export const appDataSource = new DataSource({
  type: "postgres",
  host: DB_HOST,
  port: Number.parseInt(DB_PORT, 10),
  cache: false,
  database: DB_NAME,
  username: DB_USER_NAME,
  password: DB_USER_PWD,
  ssl: getSslParam(),
  logging: TS_NODE_DEV === "true",
  synchronize: false,
  entities,
  subscribers: []
});

function getSslParam(): boolean | undefined {
  if (!DB_SSL) {
    return undefined;
  }

  const normalized = DB_SSL.toLowerCase();
  if (normalized == "false") {
    return false;
  }

  return true;
}

export async function initializeDataSource() {
  const connection = await appDataSource.initialize();
  console.log("✅ Data source connected");
  return connection;
}
