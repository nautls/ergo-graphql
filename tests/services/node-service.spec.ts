import { nodeService } from '../../src/services/node-service';

jest.mock('axios');

describe('NodeService', () => {
  it('Should workd', () => {
    expect(() => {
      nodeService.checkUrl();
    }).not.toThrowError();
  });
});
