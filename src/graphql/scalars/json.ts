import { UserInputError } from "apollo-server";
import { GraphQLScalarType, Kind } from "graphql";

export const JSONScalar = new GraphQLScalarType({
  name: "JSON",
  serialize(value) {
    if (typeof value === "object") {
      return value;
    }

    return JSON.stringify(value);
  },
  parseValue(value) {
    return value;
  },
  parseLiteral(node) {
    if (node.kind !== Kind.STRING) {
      throw new UserInputError("Invalid type.");
    }

    return JSON.parse(node.value);
  }
});
