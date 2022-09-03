import axios from "axios";
import { SignedTransactionInput } from "../graphql/input-types";

const HTTP_PREFIX_PATTERN = /^http(s?):\/\//;

export class NodeService {
  private nodeAddress: string;

  constructor(nodeAddress?: string) {
    this.nodeAddress = nodeAddress || process.env.ERGO_NODE_HOST || process.env.ERGO_NODE_ADDRESS;
    if (!this.nodeAddress) {
      throw Error("ERGO_NODE_ADDRESS is undefined in .env file.");
    } else if (!HTTP_PREFIX_PATTERN.test(this.nodeAddress)) {
      throw Error("ERGO_NODE_ADDRESS should be http:// or https:// prefixed.");
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
