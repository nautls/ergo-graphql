import { Resolver, FieldResolver, Ctx, Query, Info } from "type-graphql";
import { GraphQLResolveInfo } from "graphql";
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
    return await context.repository.headers.getLastHeaderId();
  }

  @FieldResolver()
  async height(@Ctx() context: GraphQLContext) {
    return await context.repository.headers.getMaxHeight();
  }

  @FieldResolver()
  async boxGlobalIndex(@Ctx() context: GraphQLContext) {
    return await context.repository.boxes.getMaxGlobalIndex();
  }

  @FieldResolver()
  async transactionGlobalIndex(@Ctx() context: GraphQLContext) {
    return await context.repository.transactions.getMaxGlobalIndex();
  }

  @FieldResolver()
  async params(@Ctx() context: GraphQLContext, @Info() info: GraphQLResolveInfo) {
    return await context.repository.epochs.getLast(info);
  }
}
