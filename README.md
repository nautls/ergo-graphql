# ergo-graphql

Ergo GraphQL server on top of [Ergo Platform's explorer database schema](https://github.com/ergoplatform/explorer-backend/blob/master/modules/explorer-core/src/main/resources/db/V9__Schema.sql).

This repository also includes a [TypeScript package for client-side static typing](/packages/ts-types/).

## Project setup

```
npm install
```

### Environment file pattern

The `.env` file must be placed in the root directory following the pattern described below.

```env
DB_HOST =                 # database host address
DB_PORT =                 # database host port
DB_NAME =                 # database name
DB_USER_NAME =            # database user name
DB_USER_PWD =             # database user password

ERGO_NODE_ADDRESS =       # ergo node address and port
NETWORK = MAINNET         # optional: MAINNET or TESTNET

REDIS_HOST = localhost    # optional: redis host address
REDIS_PORT = 6379         # optional: redis host port
REDIS_USER_NAME =         # optional: redis username
REDIS_USER_PWD =          # optional: redis user password

MAX_QUERY_DEPTH = 5       # optional: maximum query depth
```

### Compile and run for development

```
npm run dev
```

### Compile and run for production

```
npm run build
npm run start
```

### Run unit tests

```
npm run test
```

### Lint

```
npm run lint
```
