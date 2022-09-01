import axios from "axios";
import { SignedTransactionInput } from "../graphql/input-types";

export class NodeService {
  private nodeAddress: string;

  constructor(nodeAddress?: string) {
    this.nodeAddress = nodeAddress || process.env.ERGO_NODE_HOST || process.env.ERGO_NODE_ADDRESS;
    if (!this.nodeAddress) {
      throw Error("Node host (ERGO_NODE_HOST var) is undefined in .env file.");
    }
  }

  public checkTransaction(transaction: SignedTransactionInput) {
    return axios.post(this.nodeAddress + "/transactions/check", transaction);
  }

  public submitTransaction(transaction: SignedTransactionInput) {
    return axios.post(this.nodeAddress + "/transactions", transaction);
  }

  public getNodeInfo() {
    return axios.get(this.nodeAddress + "/info");
  }
}
