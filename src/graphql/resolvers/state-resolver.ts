import { Resolver, FieldResolver, Ctx, Query } from "type-graphql";
import { State } from "../objects";
import { GraphQLContext } from "../context-type";

@Resolver(State)
export class StateResolver {
  @Query(() => State)
  async state() {
    return {};
  }

  @FieldResolver()
  async blockId(@Ctx() context: GraphQLContext) {
    return await context.repository.headers.getLastBlockId();
  }

  @FieldResolver()
  async height(@Ctx() context: GraphQLContext) {
    return await context.repository.headers.getMaxHeight();
  }

  @FieldResolver()
  async maxBoxGlobalIndex(@Ctx() context: GraphQLContext) {
    return await context.repository.boxes.getMaxBoxIndex();
  }

  @FieldResolver()
  async maxTransactionGlobalIndex(@Ctx() context: GraphQLContext) {
    return await context.repository.transactions.getMaxTransactionIndex();
  }

  @FieldResolver()
  async params(@Ctx() context: GraphQLContext) {
    return null;
  }
}
