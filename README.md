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

MAX_QUERY_COMPLEXITY =    # Optional: maximum query complexity, default: 20
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
