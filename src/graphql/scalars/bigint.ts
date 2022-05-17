import { UserInputError } from "apollo-server";
import { GraphQLError, GraphQLScalarType, Kind } from "graphql";

export const BigIntScalar = new GraphQLScalarType({
  name: "BigInt",
  serialize: coerceBigInt,
  parseValue: coerceBigInt,
  parseLiteral(node) {
    if (node.kind !== Kind.INT) {
      throw new UserInputError("Invalid type.");
    }

    return coerceBigInt(node.value);
  }
});

function coerceBigInt(value: unknown): bigint {
  switch (typeof value) {
    case "number":
    case "string":
      return BigInt(value);
    case "bigint":
      return value;
    default:
      throw new GraphQLError("Invalid BigInt value.");
  }
}
