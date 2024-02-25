import { redisClient } from "./caching";
import { DatabaseContext } from "./context/database-context";

export const checkHealth = async(dataContext: DatabaseContext): Promise<void> => {
  /**
   * Things to check:
   * - Database connection (Done)
   * - Redis connection (Done)
   * - Node connection
   * - Block watcher
   */

  const checks = {
    db: () => dataContext.checkConnection,
    redis: async() => (await redisClient.mget("test")).length === 1,
  };

  const results = await Promise.all(
    Object.entries(checks).map(async ([key, func]) => ({
      [key]: await func(),
    }))
  );

  let isAnyFailed = false;
  for(const result of results) {
    for(const [key, value] of Object.entries(result)) {
      if(!value) {
        console.error(`🚫 Health check failed for ${key}`);
        isAnyFailed = true;
      }
    }
  }

  if(isAnyFailed) throw new Error("Health check failed");
};
