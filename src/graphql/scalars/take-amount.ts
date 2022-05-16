import { UserInputError } from "apollo-server";
import { Kind } from "graphql";
import { scalarType } from "nexus";
import { arg, ScalarArgConfig } from "nexus/dist/core";
import { DEFAULT_TAKE } from "../../consts";

function validateTakeAmount(value: unknown): number {
  if (typeof value !== "number" || !Number.isInteger(value)) {
    throw new UserInputError("Provided value is invalid.");
  }

  if (value > DEFAULT_TAKE) {
    throw new UserInputError(
      `Provided value needs to be lower or equal to ${DEFAULT_TAKE}.`
    );
  }

  return value;
}

export const takeAmountScalar = scalarType({
  name: "TakeAmount",
  asNexusMethod: "takeAmount",
  sourceType: "number",
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

export function takeAmountArg(config?: ScalarArgConfig<number>) {
  return arg({ type: takeAmountScalar, ...config });
}
