declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      DB_USER_NAME: string;
      DB_USER_PWD: string;

      REDIS_HOST?: string;
      REDIS_PORT?: string;
      REDIS_USER_NAME?: string;
      REDIS_USER_PWD?: string;

      NETWORK?: "MAINNET" | "TESTNET";
      MAX_QUERY_DEPTH?: string;

      TS_NODE_DEV: string;

      ERGO_NODE_ADDRESS: string;
    }
  }
}

// convert it into a module by adding an empty export statement.
export {};
