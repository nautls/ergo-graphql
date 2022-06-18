import { AxiosError } from "axios";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  FieldResolver,
  Info,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { NodeService } from '../../services';
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { SignedTransactionInput } from "../input-types";
import { Mempool } from "../objects";
import { PaginationArguments } from "./pagination-arguments";

@ArgsType()
class UnconfirmedTransactionArguments {
  @Field(() => String, { nullable: true })
  transactionId?: string;
}

@ArgsType()
class UnconfirmedBoxArguments {
  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => String, { nullable: true })
  ergoTreeTemplateHash?: string;
}

@Resolver(Mempool)
export class MempoolResolver {
  private nodeService: NodeService;
  constructor() {
    this.nodeService = new NodeService();
  }

  @Query(() => Mempool)
  async mempool(@Info() info: GraphQLResolveInfo) {
    info.cacheControl.setCacheHint({ maxAge: 0 });
    return {};
  }

  @FieldResolver()
  async size(@Ctx() context: GraphQLContext) {
    return await context.repository.unconfirmedTransactions.sum({ by: "size" });
  }

  @FieldResolver()
  async transactionsCount(@Ctx() context: GraphQLContext) {
    return await context.repository.unconfirmedTransactions.count();
  }

  @FieldResolver()
  async transactions(
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Args() { transactionId }: UnconfirmedTransactionArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.unconfirmedTransactions.find({
      resolverInfo: info,
      where: removeUndefined({ transactionId }),
      skip,
      take
    });
  }

  @FieldResolver()
  async boxes(
    @Args() { boxId, transactionId, address, ergoTreeTemplateHash }: UnconfirmedBoxArguments,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.unconfirmedBoxes.find({
      resolverInfo: info,
      where: removeUndefined({ boxId, transactionId, address, ergoTreeTemplateHash }),
      skip,
      take
    });
  }

  @Mutation(() => String)
  async checkTransaction(@Arg("signedTransaction") signedTransaction: SignedTransactionInput) {
    try {
      const response = await this.nodeService.checkTransaction(signedTransaction);
      return response.data;
    } catch (e) {
      console.error(e);
      if(e instanceof AxiosError){
        const error = e.response?.data;
        if(error.error === 400)
          throw new GraphQLError(error.detail);
      }
      throw new GraphQLError("Unknown error");
    }
  }

  @Mutation(() => String)
  async submitTransaction(@Arg("signedTransaction") signedTransaction: SignedTransactionInput) {
    try {
      const response = await this.nodeService.submitTransaction(signedTransaction);
      return response.data;
    } catch (e) {
      console.error(e);
      if(e instanceof AxiosError){
        const error = e.response?.data;
        if(error.error === 400)
          throw new GraphQLError(error.detail);
      }
      throw new GraphQLError("Unknown error");
    }
  }
}
