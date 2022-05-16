import { UserInputError } from "apollo-server";
import { Kind } from "graphql";
import { scalarType } from "nexus";

export const json = scalarType({
  name: "JSON",
  asNexusMethod: "json",
  sourceType: "object",
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
