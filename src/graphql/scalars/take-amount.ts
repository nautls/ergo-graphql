import { UserInputError } from "apollo-server";
import { GraphQLScalarType, Kind } from "graphql";
import { MAX_TAKE } from "../../consts";

function validateTakeAmount(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new UserInputError("Provided value is invalid.");
  }

  if (value > MAX_TAKE) {
    throw new UserInputError(`Provided value needs to be lower or equal to ${MAX_TAKE}.`);
  }

  return value;
}

export const TakeAmountScalar = new GraphQLScalarType({
  name: "TakeAmount",
  description: "Pagination take amount type",
  serialize: validateTakeAmount,
  parseValue: validateTakeAmount,
  parseLiteral(node) {
    if (node.kind !== Kind.INT) {
      throw new UserInputError("Provided value is invalid.");
    }

    return validateTakeAmount(Number.parseInt(node.value, 10));
  }
});
