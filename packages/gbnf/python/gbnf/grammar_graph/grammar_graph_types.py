"""
import type { Colorize, } from "./colorize.js";
import type { GenericSet, } from "./generic-set.js";
import type { GraphPointer, } from "./graph-pointer.js";
import { RuleRef, } from "./rule-ref.js";

export const customInspectSymbol = Symbol.for('nodejs.util.inspect.custom');
export type Pointers = GenericSet<ResolvedGraphPointer, string>;
export interface PrintOpts { pointers?: Pointers; colorize: Colorize; showPosition: boolean };

export enum RuleType {
  CHAR = 'char',
  CHAR_EXCLUDE = 'char_exclude',
  END = 'end',
}

export type Range = [number, number];

export interface RuleChar {
  type: RuleType.CHAR;
  value: (number | Range)[];
}

export interface RuleCharExclude {
  type: RuleType.CHAR_EXCLUDE;
  value: (number | Range)[];
}
export interface RuleEnd {
  type: RuleType.END;
}
export type UnresolvedRule = RuleChar | RuleCharExclude | RuleRef | RuleEnd;
// RuleRefs should never be exposed to the end user.
export type ResolvedRule = RuleCharExclude | RuleChar | RuleEnd;
export type ResolvedGraphPointer = GraphPointer<ResolvedRule>;
"""

# ValidInput can either be a string, or a number indicating a code point.
# It CANNOT be a number representing a number; a number intended as input (like "8")
# should be passed in as a string.
ValidInput = str | int | list[int]
