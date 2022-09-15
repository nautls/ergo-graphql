import { AxiosError } from "axios";
import { GraphQLError, GraphQLResolveInfo } from "graphql";
import { ArrayMaxSize, isDefined, IsEmpty, ValidateIf } from "class-validator";
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
import { NodeService } from "../../services";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { SignedTransactionInput } from "../input-types";
import { Mempool } from "../objects";
import { PaginationArguments } from "./pagination-arguments";
import { isFieldSelected } from "./utils";
import { REDUNDANT_QUERY_MESSAGE } from "./box-resolver";

@ArgsType()
class UnconfirmedTransactionArguments {
  /** @deprecated */
  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(20)
  transactionIds?: [string];

  @Field(() => String, { nullable: true })
  address?: string;
}

@ArgsType()
class UnconfirmedBoxArguments {
  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  transactionId?: string;

  @ValidateIf((o: UnconfirmedBoxArguments) => isDefined(o.ergoTree))
  @IsEmpty({ message: REDUNDANT_QUERY_MESSAGE })
  @Field(() => String, { nullable: true })
  address?: string;

  @ValidateIf((o: UnconfirmedBoxArguments) => isDefined(o.address))
  @IsEmpty({ message: REDUNDANT_QUERY_MESSAGE })
  @Field(() => String, { nullable: true })
  ergoTree?: string;

  @Field(() => String, { nullable: true })
  ergoTreeTemplateHash?: string;

  @Field(() => String, { nullable: true })
  tokenId?: string;
}

@ArgsType()
class UnconfirmedAddressesQueryArgs {
  @Field(() => [String], { nullable: false })
  @ArrayMaxSize(20)
  addresses!: string[];
}

@ArgsType()
class UnconfirmedInputsQueryArgs {
  @Field(() => String, { nullable: true })
  boxId?: string;

  @Field(() => String, { nullable: true })
  transactionId?: string;
}

@Resolver(Mempool)
export class MempoolResolver {
  private _nodeService: NodeService;

  constructor() {
    this._nodeService = new NodeService();
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
    @Args({ validate: true })
    { transactionId, transactionIds, address }: UnconfirmedTransactionArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.unconfirmedTransactions.find({
      resolverInfo: info,
      where: removeUndefined({ transactionId }),
      address,
      transactionIds,
      skip,
      take
    });
  }

  @FieldResolver()
  async boxes(
    @Args({ validate: true })
    {
      boxId,
      transactionId,
      address,
      ergoTree,
      ergoTreeTemplateHash,
      tokenId
    }: UnconfirmedBoxArguments,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.unconfirmedBoxes.find({
      resolverInfo: info,
      where: removeUndefined({ boxId, transactionId, address, ergoTree, ergoTreeTemplateHash }),
      tokenId,
      skip,
      take
    });
  }

  @FieldResolver()
  async addresses(
    @Args({ validate: true }) { addresses }: UnconfirmedAddressesQueryArgs,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    const balances = isFieldSelected(info, "balance")
      ? await context.repository.unconfirmedBoxes.sum({
          where: { addresses },
          include: {
            nanoErgs: isFieldSelected(info, "balance.nanoErgs"),
            assets: isFieldSelected(info, "balance.assets")
          }
        })
      : [];

    return addresses.map((address) => {
      return {
        address,
        balance: balances.find((b) => b.address === address) || { nanoErgs: 0, assets: [] }
      };
    });
  }

  @FieldResolver()
  async inputs(
    @Args() { boxId, transactionId }: UnconfirmedInputsQueryArgs,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return context.repository.unconfirmedInputs.find({
      resolverInfo: info,
      where: removeUndefined({ boxId, transactionId }),
      skip,
      take
    });
  }

  @Mutation(() => String)
  async checkTransaction(@Arg("signedTransaction") signedTransaction: SignedTransactionInput) {
    try {
      const response = await this._nodeService.checkTransaction(signedTransaction);
      return response.data;
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

  @Mutation(() => String)
  async submitTransaction(@Arg("signedTransaction") signedTransaction: SignedTransactionInput) {
    try {
      const response = await this._nodeService.submitTransaction(signedTransaction);
      return response.data;
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
