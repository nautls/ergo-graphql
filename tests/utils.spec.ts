import { removeUndefined } from "../src/utils";

describe("utils", () => {
  describe("removeUndefined", () => {
    it("should remove undefined values", () => {
      const result = removeUndefined({
        a: 1,
        b: undefined,
        c: null
      });

      expect(result).toEqual({
        a: 1
      });
    });
  });
});
