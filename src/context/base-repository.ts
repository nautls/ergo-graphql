/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseEntity, DataSource, EntityTarget, Repository, SelectQueryBuilder } from "typeorm";
import GraphQLDatabaseLoader, {
  EjectQueryCallback,
  GraphQLQueryBuilder
} from "@mando75/typeorm-graphql-loader";
import { FindManyParams, FindOneParams, IRepository } from "./repository-interface";
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

type QueryCallback<T extends BaseEntity> = (query: SelectQueryBuilder<T>) => SelectQueryBuilder<T>;

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
          query = this.addWhere(query as unknown as SelectQueryBuilder<T>, options.where);
          return queryCallback ? queryCallback(query) : query;
        })
        .loadMany();
    }

    const query = this.addWhere(this.createQueryBuilder(), options.where);
    return (queryCallback ? queryCallback(query) : query).getMany();
  }

  private hasJoin(query: SelectQueryBuilder<unknown>) {
    console.log(query.expressionMap.joinAttributes.map((x) => x.alias));
    return !isEmpty(query.expressionMap.joinAttributes);
  }

  protected optimizedBaseFind(
    options: FindManyParams<T>,
    queryCallback?: QueryCallback<T>
  ): Promise<T[]> {
    const primaryCol = this.repository.metadata.primaryColumns[0]?.propertyName;
    if (!primaryCol) {
      throw Error(`Primary column not found for ${this.repository.metadata.name}`);
    }

    let baseQuery = this.createQueryBuilder();
    if (queryCallback) {
      baseQuery = queryCallback(baseQuery);
    }
    baseQuery = this.addWhere(baseQuery, options.where);
    baseQuery = baseQuery.select(`${this.alias}.${primaryCol}`, primaryCol);
    baseQuery = this.selectOrderColumns(baseQuery, this.alias);

    const limitQueryAlias = `l_${this.alias}`;
    let limitQuery = this.dataSource
      .createQueryBuilder()
      .from(`(${baseQuery.getQuery()})`, limitQueryAlias)
      .skip(options.skip)
      .take(options.take);

    if (this.hasJoin(baseQuery)) {
      limitQuery = limitQuery.select(`DISTINCT("${limitQueryAlias}"."${primaryCol}")`, primaryCol);

      if (!isEmpty(this.defaults?.orderBy)) {
        limitQuery = this.selectOrderColumns(limitQuery, limitQueryAlias, { wrap: true });
        limitQuery = this.setDefaultOrder(limitQuery, limitQueryAlias, { wrap: true });
        limitQuery = this.dataSource
          .createQueryBuilder()
          .select(`"ids"."boxId"`)
          .from(`(${limitQuery.getQuery()})`, "ids");
      }
    } else {
      limitQuery = limitQuery.select(`"${limitQueryAlias}"."${primaryCol}"`, primaryCol);
      limitQuery = this.setDefaultOrder(limitQuery, limitQueryAlias, { wrap: true });
    }

    return this.createGraphQLQueryBuilder()
      .info(options.resolverInfo)
      .ejectQueryBuilder((query) => {
        query
          .where(`${this.alias}.${primaryCol} IN (${limitQuery.getQuery()})`)
          .setParameters(baseQuery.getParameters());
        query = this.setDefaultOrder(query, this.alias) as any;

        return query;
      })
      .loadMany();
  }

  protected firstBase(
    options: FindOneParams<T>,
    queryCallback?: EjectQueryCallback<T>
  ): Promise<T | null> {
    if (options.resolverInfo) {
      return this.createGraphQLQueryBuilder()
        .info(options.resolverInfo)
        .ejectQueryBuilder((query) => {
          query = this.addWhere(query as unknown as SelectQueryBuilder<T>, options.where);
          return queryCallback ? queryCallback(query) : query;
        })
        .loadOne();
    }

    const query = this.addWhere(this.createQueryBuilder(), options.where);
    return (queryCallback ? queryCallback(query) : query).getOne();
  }

  private addWhere(query: SelectQueryBuilder<any>, where?: Partial<T>) {
    const mergedWhere = this.mountWhere(where);
    if (mergedWhere && !isEmpty(mergedWhere)) {
      query = query.andWhere(mergedWhere);
    }

    return query;
  }

  private mountWhere(where?: Partial<T>): Partial<T> | undefined {
    if (this.defaults?.where) {
      return { ...where, ...this.defaults.where };
    }

    return where;
  }

  private setDefaultOrder(
    query: SelectQueryBuilder<T | unknown>,
    alias: string,
    options: { wrap: boolean } = { wrap: false }
  ) {
    if (!this.defaults?.orderBy) {
      return query;
    }

    for (const key in this.defaults.orderBy) {
      query = query.addOrderBy(
        options.wrap ? `"${alias}"."${key}"` : `${alias}.${key}`,
        this.defaults.orderBy[key]
      );
    }
    return query;
  }

  private selectOrderColumns(
    query: SelectQueryBuilder<any>,
    alias: string,
    options: { wrap: boolean } = { wrap: false }
  ) {
    if (!this.defaults?.orderBy) {
      return query;
    }

    for (const key in this.defaults.orderBy) {
      query = query.addSelect(options.wrap ? `"${alias}"."${key}"` : `${alias}.${key}`, key);
    }
    return query;
  }
}
