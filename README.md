# ergo-graphql

Ergo GraphQL server is on top of [Ergo Platform's explorer database schema](https://github.com/ergoplatform/explorer-backend/blob/master/modules/explorer-core/src/main/resources/db/V9__Schema.sql).

This repository also includes a [TypeScript package for client-side static typing](/packages/ts-types/).

## Project Setup (Manual)

```
$ npm ci
```

### Environment file pattern

The `.env` file must be placed in the root directory following the pattern described below.

```env
DB_HOST =                 # database host address
DB_PORT =                 # database host port
DB_NAME =                 # database name
DB_USER_NAME =            # database username
DB_USER_PWD =             # database password
DB_SSL =                  # optional: true or false

ERGO_NODE_ADDRESS =       # http ergo node address

REDIS_HOST = localhost    # optional: redis host address
REDIS_PORT = 6379         # optional: redis host port
REDIS_USER_NAME =         # optional: redis username
REDIS_USER_PWD =          # optional: redis user password

MAX_QUERY_DEPTH = 5       # optional: maximum query depth
TX_ORDERING =             # Possible values: "inclusionHeight_timestamp", "timestamp", default: "timestamp",
```

### Compile and run for development

```
$ npm run dev
```

### Compile and run for production

```
$ npm run build
$ npm run start
```

### Run unit tests

```
$ npm run test
```

### Lint

```
$ npm run lint
```

## Project Setup (Docker)

You can use Docker to setup the project, or just the redis, as well.

### Building the `ergo-graphql` Docker image
```
$ docker -t ergo-graphql build .
```

Using docker-compose, you can run the whole project, or just the redis container.

### Running the redis container
```
$ docker compose up -d redis # For older versions, use docker-compose
```

### Running the whole project
```
$ docker compose up -d
```

## Requesting Data

You can either install some REST-API client (like [Insomnia](https://insomnia.rest/) and [Postman](https://www.postman.com/)). Or you can use curl to send a query as well:
```
$ curl -H 'Content-Type: application/json' -X POST -d '{"query": "query {...}"}' http://server.url
```

We have a set of queries/mutation as well:
### Boxes (Query)
With this query, you can get boxes of the ergo blockchain. The arguments of this query are:
- `skip`(Int): How many items to skip; Default value is 0.
- `take`(Int): How many items to take; Default value is 50.
- `boxId`(String): To filter a unique box by id; It's deprecated, please use `boxIds` instead.
- `boxIds`([String!]): To filter a set of unique boxes by id.
- `registers`(Registers): To filter boxes that have special registers
from R4 to R9. Note that `registers` filter should be used in combination with `spent` and at least one of `boxId`, `transactionId`, `headerId`, `address`, `ergoTree` or `ergoTreeTemplateHash` fields.
- `transactionId`(String): To filter output boxes of a unique transaction.
- `headerId`(String): To filter boxes by their header id.
- `spent`(Boolean): To filter spent or unspent boxes.
- `tokenId`(String): To filter boxes which contain a certain token.
- `address`(String): To filter boxes of a specific address; It's deprecated, please use `addresses` instead.
- `addresses`([String!]): To filter boxes that belong to an array of addresses.
- `ergoTree`(String): To filter boxes that have specific ergo trees; It's deprecated, please use `ergoTrees` instead.
- `ergoTrees`([String!]): To filter boxes that have ergo trees belonging to an array.
- `ergoTreeTemplateHash`(String): To filter boxes that have a certain ergo tree template hash.
- `minHeight`(Int): To get boxes after a certain height in the blockchain (inclusive).
- `maxHeight`(Int): To get boxes before a certain height in the blockchain (inclusive).
- `heightType`(HeightFilterType): It could be either `settlement` or `creation` which indicated the type of height you want to filter boxes by.

### Tokens (Query)

Get tokens that have been minted on the ergo blockchain. The arguments of this query are:
- `skip`(Int): How many items to skip; Default value is 0.
- `take`(Int): How many items to take; Default value is 50.
- `tokenId`(String): To filter a unique token by its id; It's deprecated, please use `tokenIds` instead.
- `tokenIds`([String!]): To filter a set of unique tokens by id.
- `boxId`(String): To filter tokens by their minting box id.
- `name`(String): To filter tokens by their names. You can use wildcards like "name*". Keep in mind that the number of wildcard chars can't exceed 2.

### Inputs (Query)

To get input boxes of transactions in the ergo blockchain. The arguments of this query are:
- `skip`(Int): How many items to skip; Default value is 0.
- `take`(Int): How many items to take; Default value is 50.
- `transactionId`(String): To get input boxes of a special transaction.
- `boxId`(String): To filter a unique box by id.
- `headerId`(String): To get input boxes of a special header.

### Transactions (Query)

To get the transactions of Ergo Blockchain. The arguments of this query are:
- `skip`(Int): How many items to skip; Default value is 0.
- `take`(Int): How many items to take; Default value is 50.
- `transactionId`(String): To filter a unique transaction by is id; It's deprecated, please use `transactionIds` instead.
- `transactionIds`([String!]): To filter a set of unique transactions by id.
- `headerId`(String): To filter transaction by the header id.
- `inclusionHeight`(int): To filter transactions by the block height in which they included in the blockchain.
- `address`(String): To filter transactions of an specific address; It's deprecated, please use `addresses` instead.
- `addresses`([String!]): To filter transactions that belong to a set of addresses.
- `minHeight`(Int): To filter transactions occurring after a certain height.
- `maxHeight`(Int): To filter transactions occurring before a certain height.


### DataInputs (Query)

To get information about boxes that have been used as data input in the blockchain. The arguments of this query are:

- `skip`(Int): How many items to skip; Default value is 0.
- `take`(Int): How many items to take; Default value is 50.
- `transactionId`(String): To filter dataInputs of an specific transaction, filtering by its id.
- `boxId`(String): To filter data inputs by box id.
- `headerId`(String): To filter dataInputs of a block which has a specific headerId.

### BlockHeaders (Query)

To get info about the block headers of the blockchain. The arguments of this query are:

- `skip`(Int): How many items to skip; Default value is 0.
- `take`(Int): How many items to take; Default value is 10.
- `headerId`(String): To filter headers by their id.
- `parentId`(String): To fetch a block header using its parent id.
- `height`(Int): To retrieve a block header at a certain height.

### Addresses (Query)
To get information about some addresses on the blockchain. The argument of this query are:
- `addresses`([String!]): The list of addresses to filter.

### Mempool (Query)
To get mempool boxes of the blockchain. This query does not have any arguments/filters.

### Block (Query)
To get info about the block headers of the blockchain. The arguments of this query are:
- `skip`(Int): How many items to skip; Default value is 0.
- `take`(Int): How many items to take; Default value is 10.
- `headerId`(String): To filter the block by header id.
- `height`(Int): To filter a block with certain height.
- `minHeight`(Int): To filter all blocks after a certain height.
- `maxHeight`(Int): To filter all block before a certain height.

### State (Query)
To get the state of the graphql instance. This status contains `difficulty`, `height`, and the `network`.
This query does not have any arguments/filters.

### Info (Query)
To check info of the running graphql instance. This contains `version` for now.

### CheckTransaction (Mutation)
To check whether a transaction is valid. It will return transaction id if it's valid, and empty string otherwise.
The input of ths mutation is signedTransaction of type `SignedTransaction` which is:
```
type SignedTransaction {
  id: String!
  inpts: [TransactionInput!]!
  dataInputs: [TransactionDataInput!]!
  outputs: [TransactionOutput!]!
  size: Int
}
```

### SubmitTransaction (Mutation)
To submit a transaction into the ergo blockchain. This will send the tx to the instance's node; if the operation suceeds it'll return the id of transaction. Input is the same `SignedTransaction` as defined above.
