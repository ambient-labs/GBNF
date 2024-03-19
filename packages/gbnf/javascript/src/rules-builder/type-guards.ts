import {
  InternalRuleDef,
  InternalRuleType,
  type InternalRuleDefAltChar,
  type InternalRuleDefChar,
  type InternalRuleDefCharNot,
  type InternalRuleDefEnd,
  type InternalRuleDefReference,
} from "./types.js";

export const isRuleDefType = (type?: unknown): type is InternalRuleType => !!type && Object.values(InternalRuleType).includes(type as InternalRuleType);
export const isRuleDef = (rule?: unknown): rule is InternalRuleDef => !!rule && typeof rule === 'object' && 'type' in rule && isRuleDefType(rule.type);
export const isRuleDefAlt = (rule?: InternalRuleDef): rule is InternalRuleDefReference => rule !== undefined && rule.type === InternalRuleType.ALT;
export const isRuleDefRef = (rule?: InternalRuleDef): rule is InternalRuleDefReference => rule !== undefined && rule.type === InternalRuleType.RULE_REF;
export const isRuleDefEnd = (rule?: InternalRuleDef): rule is InternalRuleDefEnd => rule !== undefined && rule.type === InternalRuleType.END;
export const isRuleDefChar = (rule?: InternalRuleDef): rule is InternalRuleDefChar => rule !== undefined && rule.type === InternalRuleType.CHAR;
export const isRuleDefCharNot = (rule?: InternalRuleDef): rule is InternalRuleDefCharNot => rule !== undefined && rule.type === InternalRuleType.CHAR_NOT;
export const isRuleDefCharAlt = (rule?: InternalRuleDef): rule is InternalRuleDefAltChar => rule !== undefined && rule.type === InternalRuleType.CHAR_ALT;
export const isRuleDefCharRngUpper = (rule?: InternalRuleDef): rule is { type: InternalRuleType.CHAR_RNG_UPPER, value: number } => rule !== undefined && rule.type === InternalRuleType.CHAR_RNG_UPPER;
