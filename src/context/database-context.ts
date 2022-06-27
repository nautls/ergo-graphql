import GraphQLDatabaseLoader from "@mando75/typeorm-graphql-loader";
import { DataSource } from "typeorm";
import { BlockInfoEntity, DataInputEntity, InputEntity, TokenEntity } from "../entities";
import { BaseRepository, RepositoryDataContext } from "./base-repository";
import { BoxRepository } from "./box-repository";
import { HeaderRepository } from "./header-repository";
import { IRepository } from "./repository-interface";
import { TransactionRepository } from "./transactions-repository";
import { UnconfirmedBoxRepository } from "./unconfirmed-box-repository";
import { UnconfirmedTransactionRepository } from "./unconfirmed-transactions-repository";
import { EpochsRepository } from "./epochs-repository";

export class DatabaseContext {
  public readonly transactions!: TransactionRepository;
  public readonly blockInfo!: IRepository<BlockInfoEntity>;
  public readonly boxes!: BoxRepository;
  public readonly dataInputs!: IRepository<DataInputEntity>;
  public readonly inputs!: IRepository<InputEntity>;
  public readonly headers!: HeaderRepository;
  public readonly tokens!: IRepository<TokenEntity>;
  public readonly epochs!: EpochsRepository;

  public readonly unconfirmedBoxes: UnconfirmedBoxRepository;
  public readonly unconfirmedTransactions!: UnconfirmedTransactionRepository;

  constructor(dataSource: DataSource) {
    const context: RepositoryDataContext = {
      dataSource,
      graphQLDataLoader: new GraphQLDatabaseLoader(dataSource)
    };

    this.transactions = new TransactionRepository(context);
    this.boxes = new BoxRepository(context);
    this.unconfirmedTransactions = new UnconfirmedTransactionRepository(context);
    this.unconfirmedBoxes = new UnconfirmedBoxRepository(context);
    this.headers = new HeaderRepository(context);
    this.epochs = new EpochsRepository(context);

    const defaults = { where: { mainChain: true } };
    this.dataInputs = new BaseRepository(DataInputEntity, "dti", { context, defaults });
    this.inputs = new BaseRepository(InputEntity, "input", { context, defaults });
    this.tokens = new BaseRepository(TokenEntity, "token", { context });
    this.blockInfo = new BaseRepository(BlockInfoEntity, "block", {
      context,
      defaults: { ...defaults, orderBy: { height: "DESC" } }
    });
  }
}
