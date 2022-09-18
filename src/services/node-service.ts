import axios from "axios";
import { SignedTransactionInput } from "../graphql/input-types";

const HTTP_PREFIX_PATTERN = /^http(s?):\/\//;

export function checkNodeUrl(nodeUrl?: string): boolean {
  const url = nodeUrl || process.env.ERGO_NODE_HOST || process.env.ERGO_NODE_ADDRESS;

  if (!url) {
    throw Error("ERGO_NODE_ADDRESS is undefined.");
  } else if (!HTTP_PREFIX_PATTERN.test(url)) {
    throw Error("ERGO_NODE_ADDRESS should be http:// or https:// prefixed.");
  }

  return true;
}

export class NodeService {
  private baseUrl: string;

  constructor(nodeAddress?: string) {
    this.baseUrl = nodeAddress || process.env.ERGO_NODE_HOST || process.env.ERGO_NODE_ADDRESS;
    checkNodeUrl(this.baseUrl);
  }

  public checkTransaction(transaction: SignedTransactionInput) {
    return axios.post(this.baseUrl + "/transactions/check", transaction);
  }

  public submitTransaction(transaction: SignedTransactionInput) {
    return axios.post(this.baseUrl + "/transactions", transaction);
  }

  public getNodeInfo() {
    return axios.get(this.baseUrl + "/info");
  }
}
