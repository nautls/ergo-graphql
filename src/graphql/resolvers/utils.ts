import { FieldNode, GraphQLResolveInfo, Kind, SelectionSetNode, StringValueNode } from "graphql";
import { isEmpty } from "lodash";

export function getArgumentValue(
  info: GraphQLResolveInfo,
  field: string,
  argumentName: string
): unknown | undefined {
  let node = getMainNode(info);
  node = findField(node?.selectionSet, field);
  if (!node || isEmpty(node.arguments)) {
    return;
  }

  return (node.arguments?.find((arg) => arg.name.value === argumentName)?.value as StringValueNode)
    ?.value;
}

export function isFieldSelected(info: GraphQLResolveInfo, field: string): boolean {
  const fields = field.split(".");

  let node = getMainNode(info);
  for (const field of fields) {
    node = findField(node?.selectionSet, field);
    if (!node) {
      return false;
    }
  }

  return true;
}

function getMainNode(info: GraphQLResolveInfo) {
  return info.fieldNodes.find((n) => n.name.value === info.fieldName);
}

function findField(
  selectionSet: SelectionSetNode | undefined,
  field: string
): FieldNode | undefined {
  if (!selectionSet) {
    return;
  }

  return selectionSet.selections.find(
    (s) => s.kind === Kind.FIELD && s.name.value === field
  ) as FieldNode;
}
