declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_PORT: string;
      DB_NAME: string;
      DB_USER_NAME: string;
      DB_USER_PWD: string;
      TS_NODE_DEV: string;
      MAX_QUERY_COMPLEXITY?: string;
    }
  }
}

// convert it into a module by adding an empty export statement.
export {};
