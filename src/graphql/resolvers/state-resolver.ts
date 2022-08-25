import { Resolver, FieldResolver, Ctx, Query, Info } from "type-graphql";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { State } from "../objects";
import { GraphQLContext } from "../context-type";
import { NodeService } from "../../services";
import { AxiosError } from "axios";

@Resolver(State)
export class StateResolver {
  private _nodeService: NodeService;

  constructor() {
    this._nodeService = new NodeService();
  }

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

  @FieldResolver()
  async network() {
    try {
      const response = await this._nodeService.getNodeInfo();
      return response.data["network"];
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.data?.error === 400) {
          throw new GraphQLError(e.response?.data?.detail);
        }
      }

      console.error(e);
      throw new GraphQLError("Unknown error");
    }
  }

  @FieldResolver()
  async difficulty() {
    try {
      const response = await this._nodeService.getNodeInfo();
      return response.data["difficulty"];
    } catch (e) {
      if (e instanceof AxiosError) {
        if (e.response?.data?.error === 400) {
          throw new GraphQLError(e.response?.data?.detail);
        }
      }

      console.error(e);
      throw new GraphQLError("Unknown error");
    }
  }
}
