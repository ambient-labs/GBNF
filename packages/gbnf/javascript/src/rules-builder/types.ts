export enum InternalRuleType {
  CHAR = 'CHAR',
  CHAR_RNG_UPPER = 'CHAR_RNG_UPPER',
  // CHAR_RNG = 'CHAR_RNG',
  RULE_REF = 'RULE_REF',
  ALT = 'ALT',
  END = 'END',

  CHAR_NOT = 'CHAR_NOT',
  CHAR_ALT = 'CHAR_ALT',
}

export interface InternalRuleDefWithNumericValue {
  type: InternalRuleType.RULE_REF | InternalRuleType.CHAR_ALT | InternalRuleType.CHAR_RNG_UPPER;
  value: number;
}
export interface InternalRuleDefChar {
  type: InternalRuleType.CHAR;
  value: number[];
}
export interface InternalRuleDefCharNot {
  type: InternalRuleType.CHAR_NOT;
  value: number[];
}
export interface InternalRuleDefAltChar {
  type: InternalRuleType.CHAR_ALT;
  value: number;
}
export interface InternalRuleDefReference {
  type: InternalRuleType.RULE_REF;
  value: number;
}
export interface InternalRuleDefEnd {
  type: InternalRuleType.END;
}
export interface InternalRuleDefWithoutValue {
  type: InternalRuleType.ALT | InternalRuleType.END;
}
export type InternalRuleDef = InternalRuleDefChar | InternalRuleDefCharNot | InternalRuleDefWithNumericValue | InternalRuleDefWithoutValue;
export type InternalRuleDefCharOrAltChar = InternalRuleDefChar | InternalRuleDefAltChar;
