import { UserInputError } from "apollo-server";
import { Kind } from "graphql";
import { scalarType } from "nexus";

function validateBigInt(value: unknown): bigint {
  if (
    typeof value !== "number" &&
    typeof value !== "bigint" &&
    typeof value !== "string"
  ) {
    throw new Error("Invalid type.");
  }

  return BigInt(value);
}

export const bigInt = scalarType({
  name: "BigInt",
  asNexusMethod: "bigInt",
  sourceType: "bigint",
  serialize: validateBigInt,
  parseValue: validateBigInt,
  parseLiteral(node) {
    if (node.kind !== Kind.INT) {
      throw new UserInputError("Invalid type.");
    }

    return validateBigInt(BigInt(node.value));
  }
});
