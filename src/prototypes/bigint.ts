/**
 * Serialize as JSON
 */
BigInt.prototype.toJSON = function () {
  return this.toString();
};
