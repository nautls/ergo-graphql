import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { DataSource } from "typeorm";
import {
  BlockInfoEntity,
  DataInputEntity,
  HeaderEntity,
  InputEntity,
  TokenEntity
} from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { BoxRepository } from "./box-repository";
import { IRepository } from "./repository-interface";
import { TransactionRepository } from "./transactions-repository";
import { UnconfirmedTransactionRepository } from "./unconfirmed-transactions-repository";

export class DatabaseContext {
  public readonly transactions!: TransactionRepository;
  public readonly blockInfo!: IRepository<BlockInfoEntity>;
  public readonly boxes!: BoxRepository;
  public readonly dataInputs!: IRepository<DataInputEntity>;
  public readonly inputs!: IRepository<InputEntity>;
  public readonly headers!: IRepository<HeaderEntity>;
  public readonly tokens!: IRepository<TokenEntity>;

  public readonly unconfirmedTransactions!: UnconfirmedTransactionRepository;

  constructor(dataSource: DataSource) {
    const context: RepositoryDataContext = {
      dataSource,
      graphQLDataLoader: new GraphQLDatabaseLoader(dataSource),
      context: this
    };

    this.transactions = new TransactionRepository(context);
    this.blockInfo = new BaseRepository(BlockInfoEntity, "box", context, { mainChain: true });
    this.boxes = new BoxRepository(context);
    this.dataInputs = new BaseRepository(DataInputEntity, "dti", context, { mainChain: true });
    this.inputs = new BaseRepository(InputEntity, "input", context, { mainChain: true });
    this.headers = new BaseRepository(HeaderEntity, "header", context, { mainChain: true });
    this.tokens = new BaseRepository(TokenEntity, "token", context);

    this.unconfirmedTransactions = new UnconfirmedTransactionRepository(context);
  }
}
