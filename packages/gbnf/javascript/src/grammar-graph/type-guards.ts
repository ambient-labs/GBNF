import {
  GraphPointer,
} from "./graph-pointer.js";
import {
  RuleRef,
} from "./rule-ref.js";
import {
  Range,
  RuleType,
  type RuleChar,
  type RuleCharExclude,
  type RuleEnd,
  type UnresolvedRule,
} from "./types.js";

/** Type Guards */
export const isRuleType = (type?: unknown): type is RuleType => !!type && Object.values(RuleType).includes(type as RuleType);
export const isRule = (rule?: unknown): rule is UnresolvedRule => !!rule && typeof rule === 'object' && 'type' in rule && isRuleType(rule.type);
export const isRuleRef = (rule?: UnresolvedRule): rule is RuleRef => rule instanceof RuleRef;
export const isRuleEnd = (rule?: UnresolvedRule): rule is RuleEnd => rule !== undefined && !(isRuleRef(rule)) && rule.type === RuleType.END;
export const isRuleChar = (rule?: UnresolvedRule): rule is RuleChar => rule !== undefined && !(isRuleRef(rule)) && rule.type === RuleType.CHAR;
export const isRuleCharExcluded = (rule?: UnresolvedRule): rule is RuleCharExclude => rule !== undefined && !(isRuleRef(rule)) && rule.type === RuleType.CHAR_EXCLUDE;
export const isRange = (range?: unknown): range is Range => Array.isArray(range) && range.length === 2 && range.every(n => typeof n === 'number');

export const isGraphPointerRuleRef = (pointer: GraphPointer): pointer is GraphPointer<RuleRef> => isRuleRef(pointer.rule);
export const isGraphPointerRuleEnd = (pointer: GraphPointer): pointer is GraphPointer<RuleEnd> => isRuleEnd(pointer.rule);
export const isGraphPointerRuleChar = (pointer: GraphPointer): pointer is GraphPointer<RuleChar> => isRuleChar(pointer.rule);
export const isGraphPointerRuleCharExclude = (pointer: GraphPointer): pointer is GraphPointer<RuleCharExclude> => isRuleCharExcluded(pointer.rule);
