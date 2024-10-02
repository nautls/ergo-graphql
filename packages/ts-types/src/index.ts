export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: { input: any; output: any; }
};

export type AdProof = {
  __typename?: 'AdProof';
  digest: Scalars['String']['output'];
  header: Header;
  headerId: Scalars['String']['output'];
  proofBytes: Scalars['String']['output'];
};

export type Address = {
  __typename?: 'Address';
  address: Scalars['String']['output'];
  balance: AddressBalance;
  boxesCount: Scalars['Int']['output'];
  transactionsCount: Scalars['Int']['output'];
  used: Scalars['Boolean']['output'];
};

export type AddressAssetBalance = {
  __typename?: 'AddressAssetBalance';
  amount: Scalars['String']['output'];
  decimals?: Maybe<Scalars['Int']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  tokenId: Scalars['String']['output'];
};

export type AddressBalance = {
  __typename?: 'AddressBalance';
  assets: Array<AddressAssetBalance>;
  nanoErgs: Scalars['String']['output'];
};


export type AddressBalanceAssetsArgs = {
  tokenId?: InputMaybe<Scalars['String']['input']>;
};

export type Asset = IAsset & {
  __typename?: 'Asset';
  amount: Scalars['String']['output'];
  box: Box;
  boxId: Scalars['String']['output'];
  headerId: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  token: Token;
  tokenId: Scalars['String']['output'];
};

export type AssetInput = {
  amount: Scalars['String']['input'];
  tokenId: Scalars['String']['input'];
};

export type Block = {
  __typename?: 'Block';
  blockChainTotalSize: Scalars['String']['output'];
  blockCoins: Scalars['String']['output'];
  blockFee: Scalars['String']['output'];
  blockMiningTime: Scalars['String']['output'];
  blockSize: Scalars['Int']['output'];
  difficulty: Scalars['String']['output'];
  header: Header;
  headerId: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  mainChain: Scalars['Boolean']['output'];
  maxBoxGix: Scalars['String']['output'];
  maxTxGix: Scalars['String']['output'];
  minerAddress: Scalars['String']['output'];
  minerRevenue: Scalars['String']['output'];
  minerReward: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  totalCoinsInTxs: Scalars['String']['output'];
  totalCoinsIssued: Scalars['String']['output'];
  totalFees: Scalars['String']['output'];
  totalMinersReward: Scalars['String']['output'];
  totalMiningTime: Scalars['String']['output'];
  totalTxsCount: Scalars['String']['output'];
  txsCount: Scalars['Int']['output'];
  txsSize: Scalars['Int']['output'];
};

export type Box = IBox & {
  __typename?: 'Box';
  additionalRegisters: Scalars['JSONObject']['output'];
  address: Scalars['String']['output'];
  assets: Array<Asset>;
  beingSpent: Scalars['Boolean']['output'];
  boxId: Scalars['String']['output'];
  creationHeight: Scalars['Int']['output'];
  ergoTree: Scalars['String']['output'];
  ergoTreeTemplateHash: Scalars['String']['output'];
  globalIndex: Scalars['String']['output'];
  headerId: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  mainChain: Scalars['Boolean']['output'];
  settlementHeight: Scalars['Int']['output'];
  spentBy?: Maybe<Input>;
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type DataInput = IDataInput & {
  __typename?: 'DataInput';
  box: Box;
  boxId: Scalars['String']['output'];
  headerId: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  mainChain: Scalars['Boolean']['output'];
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
};

export type Epochs = {
  __typename?: 'Epochs';
  blockVersion: Scalars['Int']['output'];
  dataInputCost: Scalars['Int']['output'];
  height: Scalars['Int']['output'];
  inputCost: Scalars['Int']['output'];
  maxBlockCost: Scalars['Int']['output'];
  maxBlockSize: Scalars['Int']['output'];
  minValuePerByte: Scalars['Int']['output'];
  outputCost: Scalars['Int']['output'];
  storageFeeFactor: Scalars['Int']['output'];
  tokenAccessCost: Scalars['Int']['output'];
};

export type Extension = {
  __typename?: 'Extension';
  digest: Scalars['String']['output'];
  fields: Scalars['JSONObject']['output'];
  headerId: Scalars['String']['output'];
};

export type Header = {
  __typename?: 'Header';
  adProof: AdProof;
  adProofsRoot: Scalars['String']['output'];
  blockInfo: Block;
  difficulty: Scalars['String']['output'];
  extension: Extension;
  extensionHash: Scalars['String']['output'];
  headerId: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  mainChain: Scalars['Boolean']['output'];
  nBits: Scalars['String']['output'];
  parentId: Scalars['String']['output'];
  powSolutions: Scalars['JSONObject']['output'];
  stateRoot: Scalars['String']['output'];
  timestamp: Scalars['String']['output'];
  transactionsRoot: Scalars['String']['output'];
  version: Scalars['Int']['output'];
  votes: Array<Scalars['Int']['output']>;
};

/** The type of height that boxes must be filtered on. */
export enum HeightFilterType {
  Creation = 'creation',
  Settlement = 'settlement'
}

export type IAsset = {
  amount: Scalars['String']['output'];
  boxId: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  tokenId: Scalars['String']['output'];
};

export type IBox = {
  additionalRegisters: Scalars['JSONObject']['output'];
  address: Scalars['String']['output'];
  boxId: Scalars['String']['output'];
  creationHeight: Scalars['Int']['output'];
  ergoTree: Scalars['String']['output'];
  ergoTreeTemplateHash: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  transactionId: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type IDataInput = {
  boxId: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  transactionId: Scalars['String']['output'];
};

export type IInput = {
  box?: Maybe<Box>;
  boxId: Scalars['String']['output'];
  extension: Scalars['JSONObject']['output'];
  index: Scalars['Int']['output'];
  proofBytes?: Maybe<Scalars['String']['output']>;
  transactionId: Scalars['String']['output'];
};

export type ITransaction = {
  size: Scalars['Int']['output'];
  transactionId: Scalars['String']['output'];
};

export type Info = {
  __typename?: 'Info';
  version: Scalars['String']['output'];
};

export type Input = IInput & {
  __typename?: 'Input';
  box?: Maybe<Box>;
  boxId: Scalars['String']['output'];
  extension: Scalars['JSONObject']['output'];
  headerId: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  mainChain: Scalars['Boolean']['output'];
  proofBytes?: Maybe<Scalars['String']['output']>;
  transaction: Transaction;
  transactionId: Scalars['String']['output'];
};

export type Mempool = {
  __typename?: 'Mempool';
  addresses: Array<UnconfirmedAddress>;
  boxes: Array<UnconfirmedBox>;
  inputs: Array<UnconfirmedInput>;
  size: Scalars['Int']['output'];
  transactions: Array<UnconfirmedTransaction>;
  transactionsCount: Scalars['Int']['output'];
};


export type MempoolAddressesArgs = {
  addresses: Array<Scalars['String']['input']>;
};


export type MempoolBoxesArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  boxId?: InputMaybe<Scalars['String']['input']>;
  boxIds?: InputMaybe<Array<Scalars['String']['input']>>;
  ergoTree?: InputMaybe<Scalars['String']['input']>;
  ergoTreeTemplateHash?: InputMaybe<Scalars['String']['input']>;
  ergoTrees?: InputMaybe<Array<Scalars['String']['input']>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type MempoolInputsArgs = {
  boxId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type MempoolTransactionsArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  checkTransaction: Scalars['String']['output'];
  submitTransaction: Scalars['String']['output'];
};


export type MutationCheckTransactionArgs = {
  signedTransaction: SignedTransaction;
};


export type MutationSubmitTransactionArgs = {
  signedTransaction: SignedTransaction;
};

export type Query = {
  __typename?: 'Query';
  addresses: Array<Address>;
  blockHeaders: Array<Header>;
  blocks: Array<Block>;
  boxes: Array<Box>;
  dataInputs: Array<DataInput>;
  info: Info;
  inputs: Array<Input>;
  mempool: Mempool;
  state: State;
  tokens: Array<Token>;
  transactions: Array<Transaction>;
};


export type QueryAddressesArgs = {
  addresses: Array<Scalars['String']['input']>;
};


export type QueryBlockHeadersArgs = {
  headerId?: InputMaybe<Scalars['String']['input']>;
  headerIds?: InputMaybe<Array<Scalars['String']['input']>>;
  height?: InputMaybe<Scalars['Int']['input']>;
  parentId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBlocksArgs = {
  headerId?: InputMaybe<Scalars['String']['input']>;
  height?: InputMaybe<Scalars['Int']['input']>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryBoxesArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  boxId?: InputMaybe<Scalars['String']['input']>;
  boxIds?: InputMaybe<Array<Scalars['String']['input']>>;
  ergoTree?: InputMaybe<Scalars['String']['input']>;
  ergoTreeTemplateHash?: InputMaybe<Scalars['String']['input']>;
  ergoTrees?: InputMaybe<Array<Scalars['String']['input']>>;
  headerId?: InputMaybe<Scalars['String']['input']>;
  heightType?: InputMaybe<HeightFilterType>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  registers?: InputMaybe<Registers>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  spent?: InputMaybe<Scalars['Boolean']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryDataInputsArgs = {
  boxId?: InputMaybe<Scalars['String']['input']>;
  headerId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryInputsArgs = {
  boxId?: InputMaybe<Scalars['String']['input']>;
  headerId?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
};


export type QueryTokensArgs = {
  boxId?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  tokenId?: InputMaybe<Scalars['String']['input']>;
  tokenIds?: InputMaybe<Array<Scalars['String']['input']>>;
};


export type QueryTransactionsArgs = {
  address?: InputMaybe<Scalars['String']['input']>;
  addresses?: InputMaybe<Array<Scalars['String']['input']>>;
  headerId?: InputMaybe<Scalars['String']['input']>;
  inclusionHeight?: InputMaybe<Scalars['Int']['input']>;
  maxHeight?: InputMaybe<Scalars['Int']['input']>;
  minHeight?: InputMaybe<Scalars['Int']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  take?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  transactionIds?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type Registers = {
  R4?: InputMaybe<Scalars['String']['input']>;
  R5?: InputMaybe<Scalars['String']['input']>;
  R6?: InputMaybe<Scalars['String']['input']>;
  R7?: InputMaybe<Scalars['String']['input']>;
  R8?: InputMaybe<Scalars['String']['input']>;
  R9?: InputMaybe<Scalars['String']['input']>;
};

export type SignedTransaction = {
  dataInputs: Array<TransactionDataInput>;
  id: Scalars['String']['input'];
  inputs: Array<TransactionInput>;
  outputs: Array<TransactionOutput>;
  size?: InputMaybe<Scalars['Int']['input']>;
};

export type SpendingProofInput = {
  extension: Scalars['JSONObject']['input'];
  proofBytes: Scalars['String']['input'];
};

export type State = {
  __typename?: 'State';
  blockId: Scalars['String']['output'];
  boxGlobalIndex: Scalars['String']['output'];
  difficulty: Scalars['String']['output'];
  height: Scalars['Int']['output'];
  network: Scalars['String']['output'];
  params: Epochs;
  transactionGlobalIndex: Scalars['String']['output'];
};

export type Token = {
  __typename?: 'Token';
  box: Box;
  boxId: Scalars['String']['output'];
  decimals?: Maybe<Scalars['Int']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  emissionAmount: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  tokenId: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
};

export type Transaction = ITransaction & {
  __typename?: 'Transaction';
  coinbase: Scalars['Boolean']['output'];
  dataInputs: Array<DataInput>;
  globalIndex: Scalars['String']['output'];
  headerId: Scalars['String']['output'];
  inclusionHeight: Scalars['Int']['output'];
  index: Scalars['Int']['output'];
  inputs: Array<Input>;
  mainChain: Scalars['Boolean']['output'];
  outputs: Array<Box>;
  size: Scalars['Int']['output'];
  timestamp: Scalars['String']['output'];
  transactionId: Scalars['String']['output'];
};


export type TransactionOutputsArgs = {
  relevantOnly?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TransactionDataInput = {
  boxId: Scalars['String']['input'];
};

export type TransactionInput = {
  boxId: Scalars['String']['input'];
  spendingProof: SpendingProofInput;
};

export type TransactionOutput = {
  additionalRegisters: Scalars['JSONObject']['input'];
  assets?: InputMaybe<Array<AssetInput>>;
  boxId?: InputMaybe<Scalars['String']['input']>;
  creationHeight: Scalars['Int']['input'];
  ergoTree: Scalars['String']['input'];
  index?: InputMaybe<Scalars['Int']['input']>;
  transactionId?: InputMaybe<Scalars['String']['input']>;
  value: Scalars['String']['input'];
};

export type UnconfirmedAddress = {
  __typename?: 'UnconfirmedAddress';
  address: Scalars['String']['output'];
  balance: AddressBalance;
};

export type UnconfirmedAsset = IAsset & {
  __typename?: 'UnconfirmedAsset';
  amount: Scalars['String']['output'];
  boxId: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  token: Token;
  tokenId: Scalars['String']['output'];
};

export type UnconfirmedBox = IBox & {
  __typename?: 'UnconfirmedBox';
  additionalRegisters: Scalars['JSONObject']['output'];
  address: Scalars['String']['output'];
  assets: Array<UnconfirmedAsset>;
  beingSpent: Scalars['Boolean']['output'];
  boxId: Scalars['String']['output'];
  creationHeight: Scalars['Int']['output'];
  ergoTree: Scalars['String']['output'];
  ergoTreeTemplateHash: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  transaction: UnconfirmedTransaction;
  transactionId: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type UnconfirmedDataInput = IDataInput & {
  __typename?: 'UnconfirmedDataInput';
  boxId: Scalars['String']['output'];
  index: Scalars['Int']['output'];
  transaction: UnconfirmedTransaction;
  transactionId: Scalars['String']['output'];
};

export type UnconfirmedInput = IInput & {
  __typename?: 'UnconfirmedInput';
  box?: Maybe<Box>;
  boxId: Scalars['String']['output'];
  extension: Scalars['JSONObject']['output'];
  index: Scalars['Int']['output'];
  proofBytes?: Maybe<Scalars['String']['output']>;
  transaction: UnconfirmedTransaction;
  transactionId: Scalars['String']['output'];
};

export type UnconfirmedTransaction = ITransaction & {
  __typename?: 'UnconfirmedTransaction';
  dataInputs: Array<UnconfirmedDataInput>;
  inputs: Array<UnconfirmedInput>;
  outputs: Array<UnconfirmedBox>;
  size: Scalars['Int']['output'];
  timestamp: Scalars['String']['output'];
  transactionId: Scalars['String']['output'];
};
