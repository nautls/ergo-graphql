import { GraphQLResolveInfo } from "graphql";
import { CacheScope } from "apollo-server-types";

export function removeUndefined(value: Record<string, unknown>) {
  const result: Record<string, unknown> = {};
  for (const key in value) {
    const val = value[key];
    if (val !== undefined && val !== null) {
      result[key] = val;
    }
  }

  return result;
}

export function setDefaultCacheHint(info: GraphQLResolveInfo) {
  info.cacheControl.setCacheHint({ maxAge: 120, scope: CacheScope.Public });
}
