import { FieldNode, GraphQLResolveInfo, Kind, SelectionSetNode } from "graphql";

export function isFieldSelected(info: GraphQLResolveInfo, field: string): boolean {
  const fields = field.split(".");

  let node = info.fieldNodes.find((n) => n.name.value === info.fieldName);
  for (const field of fields) {
    node = findField(node?.selectionSet, field);
    if (!node) {
      return false;
    }
  }

  return true;
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
