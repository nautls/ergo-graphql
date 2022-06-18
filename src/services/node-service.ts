import axios from "axios";
import { SignedTransactionInput } from "../graphql/input-types";

export class NodeService {
  private nodeAddress: string;
  constructor(nodeAddress?: string) {
    this.nodeAddress = nodeAddress || process.env.ERGO_NODE_ADDRESS;
  }
  public checkTransaction(transaction: SignedTransactionInput) {
    return axios.post(this.nodeAddress + "/transactions/check", transaction);
  }
  public submitTransaction(transaction: SignedTransactionInput) {
    return axios.post(this.nodeAddress + "/transactions", transaction);
  }
}
