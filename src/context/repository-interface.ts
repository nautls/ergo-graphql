import { GraphQLResolveInfo } from "graphql";
import { BaseEntity } from "typeorm";

export type OrderBy<T> = Partial<Record<keyof T, "ASC" | "DESC">> | "none";

export type FindOneParams<T> = {
  where?: Partial<T>;
  resolverInfo: GraphQLResolveInfo;
};

export type FindManyParams<T> = FindOneParams<T> & {
  take?: number;
  skip?: number;
  orderBy?: OrderBy<T>;
};

export interface IRepository<T extends BaseEntity> {
  find(options: FindManyParams<T>): Promise<T[]>;
  first(options: FindOneParams<T>): Promise<T | null>;
}

export function isFindMany<T>(
  options: FindManyParams<T> | FindOneParams<T>
): options is FindManyParams<T> {
  return (options as FindManyParams<T>).take !== undefined;
}
