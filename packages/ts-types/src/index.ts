export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf). */
  JSONObject: any;
};

export type AdProof = {
  __typename?: 'AdProof';
  digest: Scalars['String'];
  header: Header;
  headerId: Scalars['String'];
  proofBytes: Scalars['String'];
};

export type Address = {
  __typename?: 'Address';
  address: Scalars['String'];
  balance: AddressBalance;
  boxesCount: Scalars['Int'];
  transactionsCount: Scalars['Int'];
  used: Scalars['Boolean'];
};

export type AddressAssetBalance = {
  __typename?: 'AddressAssetBalance';
  amount: Scalars['String'];
  decimals?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  tokenId: Scalars['String'];
};

export type AddressBalance = {
  __typename?: 'AddressBalance';
  assets: Array<AddressAssetBalance>;
  nanoErgs: Scalars['String'];
};


export type AddressBalanceAssetsArgs = {
  tokenId?: InputMaybe<Scalars['String']>;
};

export type Asset = IAsset & {
  __typename?: 'Asset';
  amount: Scalars['String'];
  box: Box;
  boxId: Scalars['String'];
  headerId: Scalars['String'];
  index: Scalars['Int'];
  token: Token;
  tokenId: Scalars['String'];
};

export type AssetInput = {
  amount: Scalars['String'];
  tokenId: Scalars['String'];
};

export type Block = {
  __typename?: 'Block';
  blockChainTotalSize: Scalars['String'];
  blockCoins: Scalars['String'];
  blockFee: Scalars['String'];
  blockMiningTime: Scalars['String'];
  blockSize: Scalars['Int'];
  difficulty: Scalars['String'];
  header: Header;
  headerId: Scalars['String'];
  height: Scalars['Int'];
  mainChain: Scalars['Boolean'];
  maxBoxGix: Scalars['String'];
  maxTxGix: Scalars['String'];
  minerAddress: Scalars['String'];
  minerRevenue: Scalars['String'];
  minerReward: Scalars['String'];
  timestamp: Scalars['String'];
  totalCoinsInTxs: Scalars['String'];
  totalCoinsIssued: Scalars['String'];
  totalFees: Scalars['String'];
  totalMinersReward: Scalars['String'];
  totalMiningTime: Scalars['String'];
  totalTxsCount: Scalars['String'];
  txsCount: Scalars['Int'];
  txsSize: Scalars['Int'];
};

export type Box = IBox & {
  __typename?: 'Box';
  additionalRegisters: Scalars['JSONObject'];
  address: Scalars['String'];
  assets: Array<Asset>;
  beingSpent: Scalars['Boolean'];
  boxId: Scalars['String'];
  creationHeight: Scalars['Int'];
  ergoTree: Scalars['String'];
  ergoTreeTemplateHash: Scalars['String'];
  globalIndex: Scalars['String'];
  headerId: Scalars['String'];
  index: Scalars['Int'];
  mainChain: Scalars['Boolean'];
  settlementHeight: Scalars['Int'];
  spentBy?: Maybe<Input>;
  transaction: Transaction;
  transactionId: Scalars['String'];
  value: Scalars['String'];
};

export type DataInput = IDataInput & {
  __typename?: 'DataInput';
  box: Box;
  boxId: Scalars['String'];
  headerId: Scalars['String'];
  index: Scalars['Int'];
  mainChain: Scalars['Boolean'];
  transaction: Transaction;
  transactionId: Scalars['String'];
};

export type Epochs = {
  __typename?: 'Epochs';
  blockVersion: Scalars['Int'];
  dataInputCost: Scalars['Int'];
  height: Scalars['Int'];
  inputCost: Scalars['Int'];
  maxBlockCost: Scalars['Int'];
  maxBlockSize: Scalars['Int'];
  minValuePerByte: Scalars['Int'];
  outputCost: Scalars['Int'];
  storageFeeFactor: Scalars['Int'];
  tokenAccessCost: Scalars['Int'];
};

export type Extension = {
  __typename?: 'Extension';
  digest: Scalars['String'];
  fields: Scalars['JSONObject'];
  headerId: Scalars['String'];
};

export type Header = {
  __typename?: 'Header';
  adProof: AdProof;
  adProofsRoot: Scalars['String'];
  blockInfo: Block;
  difficulty: Scalars['String'];
  extension: Extension;
  extensionHash: Scalars['String'];
  headerId: Scalars['String'];
  height: Scalars['Int'];
  mainChain: Scalars['Boolean'];
  nBits: Scalars['String'];
  parentId: Scalars['String'];
  powSolutions: Scalars['JSONObject'];
  stateRoot: Scalars['String'];
  timestamp: Scalars['String'];
  transactionsRoot: Scalars['String'];
  version: Scalars['Int'];
  votes: Array<Scalars['Int']>;
};

export type IAsset = {
  amount: Scalars['String'];
  boxId: Scalars['String'];
  index: Scalars['Int'];
  tokenId: Scalars['String'];
};

export type IBox = {
  additionalRegisters: Scalars['JSONObject'];
  address: Scalars['String'];
  boxId: Scalars['String'];
  creationHeight: Scalars['Int'];
  ergoTree: Scalars['String'];
  ergoTreeTemplateHash: Scalars['String'];
  index: Scalars['Int'];
  transactionId: Scalars['String'];
  value: Scalars['String'];
};

export type IDataInput = {
  boxId: Scalars['String'];
  index: Scalars['Int'];
  transactionId: Scalars['String'];
};

export type IInput = {
  box?: Maybe<Box>;
  boxId: Scalars['String'];
  extension: Scalars['JSONObject'];
  index: Scalars['Int'];
  proofBytes?: Maybe<Scalars['String']>;
  transactionId: Scalars['String'];
};

export type ITransaction = {
  size: Scalars['Int'];
  transactionId: Scalars['String'];
};

export type Info = {
  __typename?: 'Info';
  version: Scalars['String'];
};

export type Input = IInput & {
  __typename?: 'Input';
  box?: Maybe<Box>;
  boxId: Scalars['String'];
  extension: Scalars['JSONObject'];
  headerId: Scalars['String'];
  index: Scalars['Int'];
  mainChain: Scalars['Boolean'];
  proofBytes?: Maybe<Scalars['String']>;
  transaction: Transaction;
  transactionId: Scalars['String'];
};

export type Mempool = {
  __typename?: 'Mempool';
  addresses: Array<UnconfirmedAddress>;
  boxes: Array<UnconfirmedBox>;
  inputs: Array<UnconfirmedInput>;
  size: Scalars['Int'];
  transactions: Array<UnconfirmedTransaction>;
  transactionsCount: Scalars['Int'];
};


export type MempoolAddressesArgs = {
  addresses: Array<Scalars['String']>;
};


export type MempoolBoxesArgs = {
  address?: InputMaybe<Scalars['String']>;
  addresses?: InputMaybe<Array<Scalars['String']>>;
  boxId?: InputMaybe<Scalars['String']>;
  boxIds?: InputMaybe<Array<Scalars['String']>>;
  ergoTree?: InputMaybe<Scalars['String']>;
  ergoTreeTemplateHash?: InputMaybe<Scalars['String']>;
  ergoTrees?: InputMaybe<Array<Scalars['String']>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  tokenId?: InputMaybe<Scalars['String']>;
  transactionId?: InputMaybe<Scalars['String']>;
};


export type MempoolInputsArgs = {
  boxId?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  transactionId?: InputMaybe<Scalars['String']>;
};


export type MempoolTransactionsArgs = {
  address?: InputMaybe<Scalars['String']>;
  addresses?: InputMaybe<Array<Scalars['String']>>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  transactionId?: InputMaybe<Scalars['String']>;
  transactionIds?: InputMaybe<Array<Scalars['String']>>;
};

export type Mutation = {
  __typename?: 'Mutation';
  checkTransaction: Scalars['String'];
  submitTransaction: Scalars['String'];
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
  addresses: Array<Scalars['String']>;
};


export type QueryBlockHeadersArgs = {
  headerId?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Int']>;
  parentId?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryBlocksArgs = {
  headerId?: InputMaybe<Scalars['String']>;
  height?: InputMaybe<Scalars['Int']>;
  maxHeight?: InputMaybe<Scalars['Int']>;
  minHeight?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
};


export type QueryBoxesArgs = {
  address?: InputMaybe<Scalars['String']>;
  addresses?: InputMaybe<Array<Scalars['String']>>;
  boxId?: InputMaybe<Scalars['String']>;
  boxIds?: InputMaybe<Array<Scalars['String']>>;
  ergoTree?: InputMaybe<Scalars['String']>;
  ergoTreeTemplateHash?: InputMaybe<Scalars['String']>;
  ergoTrees?: InputMaybe<Array<Scalars['String']>>;
  headerId?: InputMaybe<Scalars['String']>;
  maxHeight?: InputMaybe<Scalars['Int']>;
  minHeight?: InputMaybe<Scalars['Int']>;
  registers?: InputMaybe<Registers>;
  skip?: InputMaybe<Scalars['Int']>;
  spent?: InputMaybe<Scalars['Boolean']>;
  take?: InputMaybe<Scalars['Int']>;
  tokenId?: InputMaybe<Scalars['String']>;
  transactionId?: InputMaybe<Scalars['String']>;
};


export type QueryDataInputsArgs = {
  boxId?: InputMaybe<Scalars['String']>;
  headerId?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  transactionId?: InputMaybe<Scalars['String']>;
};


export type QueryInputsArgs = {
  boxId?: InputMaybe<Scalars['String']>;
  headerId?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  transactionId?: InputMaybe<Scalars['String']>;
};


export type QueryTokensArgs = {
  boxId?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  tokenId?: InputMaybe<Scalars['String']>;
  tokenIds?: InputMaybe<Array<Scalars['String']>>;
};


export type QueryTransactionsArgs = {
  address?: InputMaybe<Scalars['String']>;
  addresses?: InputMaybe<Array<Scalars['String']>>;
  headerId?: InputMaybe<Scalars['String']>;
  inclusionHeight?: InputMaybe<Scalars['Int']>;
  maxHeight?: InputMaybe<Scalars['Int']>;
  minHeight?: InputMaybe<Scalars['Int']>;
  skip?: InputMaybe<Scalars['Int']>;
  take?: InputMaybe<Scalars['Int']>;
  transactionId?: InputMaybe<Scalars['String']>;
  transactionIds?: InputMaybe<Array<Scalars['String']>>;
};

export type Registers = {
  R4?: InputMaybe<Scalars['String']>;
  R5?: InputMaybe<Scalars['String']>;
  R6?: InputMaybe<Scalars['String']>;
  R7?: InputMaybe<Scalars['String']>;
  R8?: InputMaybe<Scalars['String']>;
  R9?: InputMaybe<Scalars['String']>;
};

export type SignedTransaction = {
  dataInputs: Array<TransactionDataInput>;
  id: Scalars['String'];
  inputs: Array<TransactionInput>;
  outputs: Array<TransactionOutput>;
  size?: InputMaybe<Scalars['Int']>;
};

export type SpendingProofInput = {
  extension: Scalars['JSONObject'];
  proofBytes: Scalars['String'];
};

export type State = {
  __typename?: 'State';
  blockId: Scalars['String'];
  boxGlobalIndex: Scalars['String'];
  difficulty: Scalars['String'];
  height: Scalars['Int'];
  network: Scalars['String'];
  params: Epochs;
  transactionGlobalIndex: Scalars['String'];
};

export type Token = {
  __typename?: 'Token';
  box: Box;
  boxId: Scalars['String'];
  decimals?: Maybe<Scalars['Int']>;
  description?: Maybe<Scalars['String']>;
  emissionAmount: Scalars['String'];
  name?: Maybe<Scalars['String']>;
  tokenId: Scalars['String'];
  type?: Maybe<Scalars['String']>;
};

export type Transaction = ITransaction & {
  __typename?: 'Transaction';
  coinbase: Scalars['Boolean'];
  dataInputs: Array<DataInput>;
  globalIndex: Scalars['String'];
  headerId: Scalars['String'];
  inclusionHeight: Scalars['Int'];
  index: Scalars['Int'];
  inputs: Array<Input>;
  mainChain: Scalars['Boolean'];
  outputs: Array<Box>;
  size: Scalars['Int'];
  timestamp: Scalars['String'];
  transactionId: Scalars['String'];
};


export type TransactionOutputsArgs = {
  relevantOnly?: InputMaybe<Scalars['Boolean']>;
};

export type TransactionDataInput = {
  boxId: Scalars['String'];
};

export type TransactionInput = {
  boxId: Scalars['String'];
  spendingProof: SpendingProofInput;
};

export type TransactionOutput = {
  additionalRegisters: Scalars['JSONObject'];
  assets?: InputMaybe<Array<AssetInput>>;
  boxId?: InputMaybe<Scalars['String']>;
  creationHeight: Scalars['Int'];
  ergoTree: Scalars['String'];
  index?: InputMaybe<Scalars['Int']>;
  transactionId?: InputMaybe<Scalars['String']>;
  value: Scalars['String'];
};

export type UnconfirmedAddress = {
  __typename?: 'UnconfirmedAddress';
  address: Scalars['String'];
  balance: AddressBalance;
};

export type UnconfirmedAsset = IAsset & {
  __typename?: 'UnconfirmedAsset';
  amount: Scalars['String'];
  boxId: Scalars['String'];
  index: Scalars['Int'];
  token: Token;
  tokenId: Scalars['String'];
};

export type UnconfirmedBox = IBox & {
  __typename?: 'UnconfirmedBox';
  additionalRegisters: Scalars['JSONObject'];
  address: Scalars['String'];
  assets: Array<UnconfirmedAsset>;
  boxId: Scalars['String'];
  creationHeight: Scalars['Int'];
  ergoTree: Scalars['String'];
  ergoTreeTemplateHash: Scalars['String'];
  index: Scalars['Int'];
  transaction: UnconfirmedTransaction;
  transactionId: Scalars['String'];
  value: Scalars['String'];
};

export type UnconfirmedDataInput = IDataInput & {
  __typename?: 'UnconfirmedDataInput';
  boxId: Scalars['String'];
  index: Scalars['Int'];
  transaction: UnconfirmedTransaction;
  transactionId: Scalars['String'];
};

export type UnconfirmedInput = IInput & {
  __typename?: 'UnconfirmedInput';
  box?: Maybe<Box>;
  boxId: Scalars['String'];
  extension: Scalars['JSONObject'];
  index: Scalars['Int'];
  proofBytes?: Maybe<Scalars['String']>;
  transaction: UnconfirmedTransaction;
  transactionId: Scalars['String'];
};

export type UnconfirmedTransaction = ITransaction & {
  __typename?: 'UnconfirmedTransaction';
  dataInputs: Array<UnconfirmedDataInput>;
  inputs: Array<UnconfirmedInput>;
  outputs: Array<UnconfirmedBox>;
  size: Scalars['Int'];
  timestamp: Scalars['String'];
  transactionId: Scalars['String'];
};
