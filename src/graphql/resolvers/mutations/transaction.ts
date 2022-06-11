import { Arg, Mutation, Resolver } from "type-graphql";
import { ErgoTransactionInput } from "../../inputs"

@Resolver()
export class ErgoTransactionResolver {
  @Mutation(() => String)
  async checkTransaction(
    @Arg('ErgoTransaction') transactionInput: ErgoTransactionInput
  ) {
    return "2ab9da11fc216660e974842cc3b7705e62ebb9e0bf5ff78e53f9cd40abadd117";
  }

  @Mutation(() => String)
  async submitTransaction(
    @Arg('ErgoTransaction') transactionInput: ErgoTransactionInput
  ) {
    return "2ab9da11fc216660e974842cc3b7705e62ebb9e0bf5ff78e53f9cd40abadd117";
  }
}
