# ergo-graphql

Ergo GraphQL server on top of [Ergo Platform's explorer database schema](https://github.com/ergoplatform/explorer-backend/blob/master/modules/explorer-core/src/main/resources/db/V9__Schema.sql).

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

REDIS_HOST =              # optional: redis host address, default: localhost
REDIS_PORT =              # optional: redis host port, default: 6379
REDIS_USER_NAME =         # optional: redis username, no default
REDIS_USER_PWD =          # optional: redis user password, no default

MAX_QUERY_DEPTH =         # optional: maximum query depth, default: 5
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
