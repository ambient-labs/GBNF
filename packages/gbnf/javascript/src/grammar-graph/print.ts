import { Color, } from "./colorize.js";
import { getParentStackId, } from "./get-parent-stack-id.js";
import type { GraphNode, } from "./graph-node.js";
import type { GraphPointer, } from "./graph-pointer.js";
import {
  type PrintOpts,
} from "./types.js";
import {
  isRange,
  isRuleChar,
  isRuleRef,
} from './type-guards.js';

export const printGraphPointer = (pointer: GraphPointer) => (
  {
    colorize: col,
  }: Omit<PrintOpts, 'pointers' | 'showPosition'>
): string => col(
  `*${getParentStackId(pointer, col)}`,
  Color.RED,
);

export const printGraphNode = (node: GraphNode) => ({ pointers, showPosition = false, colorize: col, }: PrintOpts): string => {
  const rule = node.rule;

  const parts: (string | number)[] = [];
  if (showPosition) {
    parts.push(
      col('{', Color.BLUE),
      col(node.id, Color.GRAY),
      col('}', Color.BLUE),
    );
  }
  if (isRuleChar(rule)) {
    parts.push(
      col('[', Color.GRAY),
      col(rule.value.map(v => {
        if (isRange(v)) {
          return v.map(val => col(String.fromCharCode(val), Color.YELLOW));
        }
        return getChar(v);
      }).join(''), Color.YELLOW),
      col(']', Color.GRAY),
    );
  } else if (isRuleRef(rule)) {
    parts.push(col('Ref(', Color.GRAY) + col(`${rule.value}`, Color.GREEN) + col(')', Color.GRAY));
  } else {
    parts.push(col(rule.type, Color.YELLOW));
  }

  if (pointers) {
    for (const pointer of pointers) {
      const pointerParts: string[] = [];
      if (pointer.node === node) {
        pointerParts.push(
          pointer.print({ colorize: col, }),
        );
      }
      if (pointerParts.length) {
        parts.push(col('[', Color.GRAY));
        parts.push(...pointerParts);
        parts.push(col(']', Color.GRAY));
      }
    }
  }
  return [
    parts.join(''),
    node.next?.print({ pointers, colorize: col, showPosition, }),
  ].filter(Boolean).join(col('-> ', Color.GRAY));
};

const getChar = (charCode: number) => {
  const char = String.fromCharCode(charCode);
  switch (char) {
    case '\n':
      return '\\n';
    default:
      return char;
  }
};
