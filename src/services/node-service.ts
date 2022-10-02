import axios from "axios";
import { SignedTransactionInput } from "../graphql/input-types";

const HTTP_PREFIX_PATTERN = /^http(s?):\/\//;

class NodeService {
  private _baseUrl: string;

  constructor() {
    this._baseUrl = process.env.ERGO_NODE_HOST || process.env.ERGO_NODE_ADDRESS;
    this.checkUrl();
  }

  public checkUrl(): boolean {
    if (!this._baseUrl) {
      throw Error("ERGO_NODE_ADDRESS is undefined.");
    } else if (!HTTP_PREFIX_PATTERN.test(this._baseUrl)) {
      throw Error("ERGO_NODE_ADDRESS should be http:// or https:// prefixed.");
    }

    return true;
  }

  public checkTransaction(transaction: SignedTransactionInput) {
    return axios.post(this._baseUrl + "/transactions/check", transaction);
  }

  public submitTransaction(transaction: SignedTransactionInput) {
    return axios.post(this._baseUrl + "/transactions", transaction);
  }

  public getNodeInfo() {
    return axios.get(this._baseUrl + "/info");
  }
}

export const nodeService = new NodeService();
