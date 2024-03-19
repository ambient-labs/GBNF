import {
  type UnresolvedRule,
  RuleType,
} from "./types.js";
import {
  isRuleChar,
  isRuleCharExcluded,
  isRuleEnd,
  isRuleRef,
} from './type-guards.js';

export const KEY_TRANSLATION = {
  [RuleType.END]: 0,
  [RuleType.CHAR]: 1,
  [RuleType.CHAR_EXCLUDE]: 2,
};

export function getSerializedRuleKey<R extends UnresolvedRule>(rule: R): string {
  if (isRuleEnd(rule)) {
    return `${KEY_TRANSLATION[RuleType.END]}`;
  }

  if (isRuleChar(rule) || isRuleCharExcluded(rule)) {
    return `${KEY_TRANSLATION[rule.type]}-${JSON.stringify(rule.value)}`;
  }
  if (isRuleRef(rule)) {
    return `3-${rule.value}`;
  }
  throw new Error(`Unknown rule type: ${JSON.stringify(rule)}`);
};
