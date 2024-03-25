import { GraphQLResolveInfo } from "graphql";
import {
  Arg,
  Args,
  ArgsType,
  Ctx,
  Field,
  Info,
  Int,
  Mutation,
  Query,
  Resolver
} from "type-graphql";
import { Transaction } from "../objects/transaction";
import { removeUndefined } from "../../utils";
import { GraphQLContext } from "../context-type";
import { PaginationArguments } from "./pagination-arguments";
import { ArrayMaxSize } from "class-validator";
import { ReduceTransactionInput } from "../input-types";
import * as wasm from "ergo-lib-wasm-nodejs";
import { nodeService } from "../../services";

@ArgsType()
class TransactionArguments {
  /** @deprecated */
  @Field(() => String, { nullable: true })
  transactionId?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(20)
  transactionIds?: string[];

  @Field(() => String, { nullable: true })
  headerId?: string;

  @Field(() => Int, { nullable: true })
  inclusionHeight?: number;

  /** @deprecated */
  @Field(() => String, { nullable: true })
  address?: string;

  @Field(() => [String], { nullable: true })
  @ArrayMaxSize(20)
  addresses?: string[];

  @Field(() => Int, { nullable: true })
  minHeight?: number;

  @Field(() => Int, { nullable: true })
  maxHeight?: number;
}

@Resolver(Transaction)
export class TransactionResolver {
  @Query(() => [Transaction])
  async transactions(
    @Args({ validate: true })
    {
      transactionId,
      transactionIds,
      headerId,
      inclusionHeight,
      address,
      addresses,
      minHeight,
      maxHeight
    }: TransactionArguments,
    @Args({ validate: true }) { skip, take }: PaginationArguments,
    @Ctx() context: GraphQLContext,
    @Info() info: GraphQLResolveInfo
  ) {
    return await context.repository.transactions.find({
      resolverInfo: info,
      where: removeUndefined({
        transactionId,
        headerId,
        inclusionHeight
      }),
      transactionIds,
      address,
      addresses,
      minHeight,
      maxHeight,
      skip,
      take
    });
  }

  @Mutation(() => String)
  async reduceTransaction(@Arg("transaction") transaction: ReduceTransactionInput) {
    try {
      const tx = wasm.UnsignedTransaction.from_json(transaction.unsignedTransaction);
      const ergoBoxes = wasm.ErgoBoxes.from_boxes_json(transaction.inputBoxes);
      const dataInputBoxes = wasm.ErgoBoxes.from_boxes_json(transaction.dataInputBoxes);
      const ctx = await nodeService.getStateContext();

      const reducedTx = wasm.ReducedTransaction.from_unsigned_tx(
        tx,
        ergoBoxes,
        dataInputBoxes,
        ctx
      );

      return reducedTx.sigma_serialize_bytes().toString();
    } catch (e: any) {
      console.error(e);
      throw new Error(`Failed to reduce transaction! ${e.message}`);
    }
  }
}
