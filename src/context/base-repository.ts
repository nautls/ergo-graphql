/* eslint-disable @typescript-eslint/no-explicit-any */

import { BaseEntity, DataSource, EntityTarget, Repository, SelectQueryBuilder } from "typeorm";
import GraphQLDatabaseLoader, {
  EjectQueryCallback,
  GraphQLQueryBuilder
} from "@ergo-graphql/typeorm-graphql-loader";
import { FindManyParams, FindOneParams, IRepository, OrderBy } from "./repository-interface";
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

type QueryCallback<T extends BaseEntity> = (query: SelectQueryBuilder<T>) => SelectQueryBuilder<T>;

export class BaseRepository<T extends BaseEntity> implements IRepository<T> {
  protected readonly repository!: Repository<T>;
  protected readonly dataSource!: DataSource;

  protected readonly createGraphQLQueryBuilder!: () => GraphQLQueryBuilder<any>;
  protected readonly alias!: string;

  private readonly _defaults?: RepositoryDefaults<T>;

  constructor(entity: EntityTarget<T>, alias: string, options: RepositoryOptions<T>) {
    this.alias = alias;
    this.dataSource = options.context.dataSource;
    this.repository = options.context.dataSource.getRepository(entity);
    this.createGraphQLQueryBuilder = () =>
      options.context.graphQLDataLoader.loadEntity(entity as any, alias);
    this._defaults = options.defaults;
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

  private _hasJoinWithManyRows(query: SelectQueryBuilder<any>) {
    return (
      !isEmpty(query.expressionMap.joinAttributes) &&
      query.expressionMap.joinAttributes.find((j) => !j.relation || !j.relation.isOneToOne)
    );
  }

  private _isColumnSelected(query: SelectQueryBuilder<any>, columnName: string) {
    return (
      query.expressionMap.selects.findIndex(
        (s) => s.selection.endsWith(columnName) || s.aliasName === columnName
      ) > -1
    );
  }

  protected findBase(
    options: FindManyParams<T>,
    filterCallback?: QueryCallback<T>,
    selectCallback?: QueryCallback<any>
  ): Promise<T[]> {
    const primaryCol = this.repository.metadata.primaryColumns[0]?.propertyName;
    if (!primaryCol) {
      throw Error(`Primary column not found for ${this.repository.metadata.name}`);
    }

    let baseQuery = this.createQueryBuilder();
    if (filterCallback) {
      baseQuery = filterCallback(baseQuery);
    }

    if (!this._isColumnSelected(baseQuery, primaryCol)) {
      baseQuery = baseQuery.select(`${this.alias}.${primaryCol}`, primaryCol);
    }
    baseQuery = this.addWhere(baseQuery, options.where);
    baseQuery = this._selectOrderColumns(baseQuery, this.alias, {
      wrap: false,
      orderBy: options.orderBy
    });

    const limitQueryAlias = `l_${this.alias}`;
    let limitQuery = this.dataSource
      .createQueryBuilder()
      .from(`(${baseQuery.getQuery()})`, limitQueryAlias)
      .skip(options.skip)
      .take(options.take);

    if (this._hasJoinWithManyRows(baseQuery)) {
      limitQuery = limitQuery.select(`DISTINCT("${limitQueryAlias}"."${primaryCol}")`, primaryCol);

      if (
        (!isEmpty(this._defaults?.orderBy) || !isEmpty(options.orderBy)) &&
        options.orderBy !== "none"
      ) {
        limitQuery = this._selectOrderColumns(limitQuery, limitQueryAlias, {
          wrap: true,
          orderBy: options.orderBy
        });

        limitQuery = this._setOrder(limitQuery, limitQueryAlias, {
          wrap: true,
          orderBy: options.orderBy
        });

        limitQuery = this.dataSource
          .createQueryBuilder()
          .select(`"ids"."${primaryCol}"`)
          .from(`(${limitQuery.getQuery()})`, "ids");
      }
    } else {
      limitQuery = limitQuery.select(`"${limitQueryAlias}"."${primaryCol}"`, primaryCol);
      limitQuery = this._setOrder(limitQuery, limitQueryAlias, {
        wrap: true,
        orderBy: options.orderBy
      });
    }

    return this.createGraphQLQueryBuilder()
      .info(options.resolverInfo)
      .ejectQueryBuilder((query) => {
        query
          .where(`${this.alias}.${primaryCol} IN (${limitQuery.getQuery()})`)
          .setParameters(baseQuery.getParameters());
        query = this._setOrder(query, this.alias, { wrap: false, orderBy: options.orderBy }) as any;

        return selectCallback ? selectCallback(query) : query;
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
    const mergedWhere = this._mountWhere(where);
    if (mergedWhere && !isEmpty(mergedWhere)) {
      query = query.andWhere(mergedWhere);
    }

    return query;
  }

  private _mountWhere(where?: Partial<T>): Partial<T> | undefined {
    if (this._defaults?.where) {
      return { ...where, ...this._defaults.where };
    }

    return where;
  }

  private _setOrder(
    query: SelectQueryBuilder<any>,
    alias: string,
    options?: { wrap: boolean; orderBy?: OrderBy<T> }
  ) {
    if (isEmpty(options)) {
      options = { wrap: false };
    }

    if (isEmpty(options.orderBy)) {
      options.orderBy = this._defaults?.orderBy;
    }

    if (!options.orderBy || options.orderBy === "none") {
      return query;
    }

    for (const key in options.orderBy) {
      query = query.addOrderBy(
        options.wrap ? `"${alias}"."${key}"` : `${alias}.${key}`,
        options.orderBy[key]
      );
    }

    return query;
  }

  private _selectOrderColumns(
    query: SelectQueryBuilder<any>,
    alias: string,
    options?: { wrap: boolean; orderBy?: OrderBy<T> }
  ) {
    if (isEmpty(options)) {
      options = { wrap: false };
    }

    if (isEmpty(options.orderBy)) {
      options.orderBy = this._defaults?.orderBy;
    }

    if (!options.orderBy || options.orderBy === "none") {
      return query;
    }

    const primaryCol = this.repository.metadata.primaryColumns[0]?.propertyName;

    for (const key in options.orderBy) {
      if (key === primaryCol) {
        continue;
      }

      query = query.addSelect(options.wrap ? `"${alias}"."${key}"` : `${alias}.${key}`, key);
    }

    return query;
  }
}
