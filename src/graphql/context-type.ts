import { DatabaseContext } from "../context/database-context";

export type GraphQLContext = {
  repository: DatabaseContext;
};

export type GraphQLContextWithArgs<T> = GraphQLContext & {
  args: T;
};
