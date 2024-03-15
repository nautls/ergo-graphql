import axios from "axios";
import { SignedTransactionInput } from "../graphql/input-types";
import * as wasm from "ergo-lib-wasm-nodejs";

const HTTP_PREFIX_PATTERN = /^http(s?):\/\//;

class NodeService {
  private _baseUrl: string;

  constructor() {
    this._baseUrl = process.env.ERGO_NODE_HOST || process.env.ERGO_NODE_ADDRESS;
    this.checkUrl();
  }

  public checkUrl(): void {
    if (!this._baseUrl) {
      throw Error("ERGO_NODE_ADDRESS is undefined.");
    } else if (!HTTP_PREFIX_PATTERN.test(this._baseUrl)) {
      throw Error("ERGO_NODE_ADDRESS should be http:// or https:// prefixed.");
    }
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

  public getStateContext = async () => {
    // TODO: Error handling
    // TODO: Add JSON-BI
    const lastHeaderResponse = await axios.get(this._baseUrl + "/blocks/lastHeaders/10")
    const lastBlocks = lastHeaderResponse.data as JSON[];
    const lastBlocksStrings = lastBlocks.map((header) =>
      JSON.stringify(header)
    );
    const lastBlocksHeaders = wasm.BlockHeaders.from_json(lastBlocksStrings);
    const lastBlockPreHeader = wasm.PreHeader.from_block_header(
      lastBlocksHeaders.get(0)
    );

    const stateContext = new wasm.ErgoStateContext(
      lastBlockPreHeader,
      lastBlocksHeaders
    );

    return stateContext;
  }
}

export const nodeService = new NodeService();
