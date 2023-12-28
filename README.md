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
### Box (Query)

### Tokens (Query)

### Inputs (Query)

### Transactions (Query)

### DataInputs (Query)

### BlockHeaders (Query)

### Addresses (Query)

### Mempool (Query)

### Block (Query)

### State (Query)

### Info (Query)

### CheckTransaction (Mutation)

### SubmitTransaction (Mutation)

