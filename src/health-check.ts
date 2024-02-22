import { DatabaseContext } from "./context/database-context";

export const checkHealth = async(dataContext: DatabaseContext): Promise<boolean> => {
  /**
   * Things to check:
   * - Database connection
   * - Redis connection
   * - Node connection
   * - Block watcher
   */
  const checks = {
    db: dataContext.checkConnection
  };

  // const healthy = Object.values(checks).every(() => true);
  // There's no feature in apollo-server-express to return custom error messages, so we leave it empty
  throw new Error("");
};
