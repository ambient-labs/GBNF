import {
  Color,
  type Colorize,
} from "./colorize.js";
import type {
  GraphPointer,
} from "./graph-pointer.js";

export const getParentStackId = (pointer: GraphPointer, col: Colorize): string => {
  const stackIds: string[] = [];
  let parent: undefined | GraphPointer = pointer.parent;
  while (parent) {
    const { node: { meta: { stackId, pathId, stepId, }, }, } = parent;
    // stackIds.push(`${parent.node.stackId}`);
    stackIds.push(`${stackId},${pathId},${stepId}`);
    parent = parent.parent;
  }
  return stackIds.map(id => col(id, Color.RED)).join(col('<-', Color.GRAY));
};

