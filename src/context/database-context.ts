import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { DataSource } from "typeorm";
import {
  BlockInfoEntity,
  DataInputEntity,
  HeaderEntity,
  InputEntity,
  TokenEntity,
  UnconfirmedBoxEntity
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

  public readonly unconfirmedBoxes: IRepository<UnconfirmedBoxEntity>;

  public readonly unconfirmedTransactions!: UnconfirmedTransactionRepository;

  constructor(dataSource: DataSource) {
    const context: RepositoryDataContext = {
      dataSource,
      graphQLDataLoader: new GraphQLDatabaseLoader(dataSource)
    };

    this.transactions = new TransactionRepository(context);
    this.boxes = new BoxRepository(context);
    this.unconfirmedTransactions = new UnconfirmedTransactionRepository(context);

    const defaults = { where: { mainChain: true } };
    this.dataInputs = new BaseRepository(DataInputEntity, "dti", { context, defaults });
    this.inputs = new BaseRepository(InputEntity, "input", { context, defaults });
    this.tokens = new BaseRepository(TokenEntity, "token", { context });
    this.unconfirmedBoxes = new BaseRepository(UnconfirmedBoxEntity, "u_box", { context });

    this.blockInfo = new BaseRepository(BlockInfoEntity, "block", {
      context,
      defaults: { ...defaults, orderBy: { height: "DESC" } }
    });

    this.headers = new BaseRepository(HeaderEntity, "header", {
      context,
      defaults: { ...defaults, orderBy: { height: "DESC" } }
    });
  }
}
