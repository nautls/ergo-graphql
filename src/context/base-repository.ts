/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseEntity, DataSource, EntityTarget, Repository, SelectQueryBuilder } from "typeorm";
import GraphQLDatabaseLoader, {
  EjectQueryCallback,
  GraphQLQueryBuilder
} from "@mando75/typeorm-graphql-loader";
import { FindManyParams, FindOneParams, IRepository, isFindMany } from "./repository-interface";
import { isEmpty } from "lodash";

export type RepositoryDataContext = {
  dataSource: DataSource;
  graphQLDataLoader: GraphQLDatabaseLoader;
};

export type RepositoryDefaults<T> = {
  where?: Partial<T>;
  orderBy?: OrderBy<T>;
};

export type RepositoryOptions<T> = {
  context: RepositoryDataContext;
  defaults?: RepositoryDefaults<T>;
};

type OrderBy<T> = Partial<Record<keyof T, "ASC" | "DESC">>;

export class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected readonly repository!: Repository<T>;
  protected readonly dataSource!: DataSource;

  protected readonly createGraphQLQueryBuilder!: () => GraphQLQueryBuilder<any>;
  protected readonly alias!: string;

  private readonly defaults?: RepositoryDefaults<T>;

  constructor(entity: EntityTarget<T>, alias: string, options: RepositoryOptions<T>) {
    this.alias = alias;
    this.dataSource = options.context.dataSource;
    this.repository = options.context.dataSource.getRepository(entity);
    this.createGraphQLQueryBuilder = () =>
      options.context.graphQLDataLoader.loadEntity(entity as any, alias);
    this.defaults = options.defaults;
  }

  protected createQueryBuilder(): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(this.alias);
  }

  public async find(options: FindManyParams<T>): Promise<T[]> {
    return this.findBase(options);
  }

  public async first(options: FindOneParams<T>): Promise<T | null> {
    return this.firstBase(options);
  }

  protected findBase(
    options: FindManyParams<T>,
    queryCallback?: EjectQueryCallback<T>
  ): Promise<T[]> {
    if (options.resolverInfo) {
      return this.createGraphQLQueryBuilder()
        .info(options.resolverInfo)
        .ejectQueryBuilder((query) => {
          query = this.mountQuery(query as unknown as SelectQueryBuilder<T>, options);
          return queryCallback ? queryCallback(query) : query;
        })
        .loadMany();
    }

    const query = this.mountQuery(this.createQueryBuilder(), options);
    return (queryCallback ? queryCallback(query) : query).getMany();
  }

  protected firstBase(
    options: FindOneParams<T>,
    queryCallback?: EjectQueryCallback<T>
  ): Promise<T | null> {
    if (options.resolverInfo) {
      return this.createGraphQLQueryBuilder()
        .info(options.resolverInfo)
        .ejectQueryBuilder((query) => {
          query = this.mountQuery(query as unknown as SelectQueryBuilder<T>, options);
          return queryCallback ? queryCallback(query) : query;
        })
        .loadOne();
    }

    const query = this.mountQuery(this.createQueryBuilder(), options);
    return (queryCallback ? queryCallback(query) : query).getOne();
  }

  private mountQuery(query: SelectQueryBuilder<T>, options: FindManyParams<T> | FindOneParams<T>) {
    if (isFindMany(options)) {
      query = query.skip(options.skip).take(options.take);
    }

    if (this.defaults?.orderBy) {
      for (const key in this.defaults.orderBy) {
        query = query.addOrderBy(`${this.alias}.${key}`, this.defaults.orderBy[key]);
      }
    }

    const where = this.createWhere(options.where);
    if (where && !isEmpty(where)) {
      query = query.where(where);
    }

    return query as any;
  }

  private createWhere(where?: Partial<T>): Partial<T> | undefined {
    if (this.defaults?.where) {
      return { ...where, ...this.defaults.where };
    }

    return where;
  }
}
