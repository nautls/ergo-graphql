import axios from "axios";
import { nodeService } from '../../src/services/node-service';

jest.mock('axios');

describe('NodeService', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  /**
   * @description Test if the checkUrl runs without throwing an error
   * @expected Should not throw an error
   */
  it('Should not return error while checking URL', () => {
    expect(() => {
      nodeService.checkUrl();
    }).not.toThrowError();
  });

  /**
   * @description Run getNodeInfo to feth the info from the node
   * @expected Should return nodeInfo
   */
  it('Should return nodeInfo', async() => {
    axios.get = jest.fn().mockResolvedValue({ nodeInfo: 1 });
    const nodeInfo = await nodeService.getNodeInfo();
    expect(nodeInfo).toEqual({ nodeInfo: 1 });
  });

  /**
   * @description Run checkTransaction to check the transaction
   * @expected Should return transaction
   */
  it('Should return transaction', async() => {
    axios.post = jest.fn().mockResolvedValue({ transaction: 1 });
    const transaction = await nodeService.checkTransaction(null as any);
    expect(transaction).toEqual({ transaction: 1 });
  });

  /**
   * @description Run submitTransaction to submit the transaction
   * @expected Should return transaction
   */ 
  it('Should return transaction', async() => {
    axios.post = jest.fn().mockResolvedValue({ transaction: 1 });
    const transaction = await nodeService.submitTransaction(null as any);
    expect(transaction).toEqual({ transaction: 1 });
  });

});
