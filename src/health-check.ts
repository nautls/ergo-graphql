import { blockWatcher } from "./block-watcher";
import { redisClient } from "./caching";
import { DatabaseContext } from "./context/database-context";
import { nodeService } from "./services";

export const checkHealth = async (dataContext: DatabaseContext): Promise<void> => {
  const checks = {
    db: () => () => dataContext.checkConnection,
    redis: async () => (await redisClient.mget("test")).length === 1,
    node: async () => (await nodeService.getNodeInfo()).status === 200,
    blockWatcher: () => blockWatcher.isHealthy()
  };

  const results = await Promise.all(
    Object.entries(checks).map(async ([key, func]) => ({
      [key]: await func()
    }))
  );

  let isAnyFailed = false;
  for (const result of results) {
    for (const [key, value] of Object.entries(result)) {
      if (!value) {
        console.error(`🚫 ${key} is not healthy.`);
        isAnyFailed = true;
      }
    }
  }

  if (isAnyFailed) throw new Error("Service is unhealthy.");
};
