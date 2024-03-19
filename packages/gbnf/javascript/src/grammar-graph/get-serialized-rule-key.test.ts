import { vi, describe, it, expect } from 'vitest';
import { KEY_TRANSLATION, getSerializedRuleKey } from './get-serialized-rule-key.js';

import {
  RuleEnd,
  RuleType,
  RuleChar,
  RuleCharExclude,
  isRuleEnd,
  isRuleChar,
  isRuleCharExcluded,
  isRuleRef,
} from './types.js';
import type * as _types from './types.js';
import { RuleRef } from './rule-ref.js';

// Mock the entire module
vi.mock('./types.js', async () => {
  const actual = await vi.importActual('./types.js') as typeof _types;
  return {
    ...actual,
    isRuleEnd: vi.fn().mockImplementation(() => false),
    isRuleChar: vi.fn().mockImplementation(() => false),
    isRuleCharExcluded: vi.fn().mockImplementation(() => false),
    isRuleRef: vi.fn().mockImplementation(() => false),
  };
});

// Example tests
describe('getSerializedRuleKey', () => {
  beforeEach(() => {
    vi.mocked(isRuleEnd).mockReturnValue(false);
    vi.mocked(isRuleChar).mockReturnValue(false);
    vi.mocked(isRuleCharExcluded).mockReturnValue(false);
    vi.mocked(isRuleRef).mockReturnValue(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('returns type for end rules', () => {
    vi.mocked(isRuleEnd).mockReturnValue(true);
    const rule: RuleEnd = { type: RuleType.END };
    expect(getSerializedRuleKey(rule)).toBe(`${KEY_TRANSLATION[RuleType.END]}`);
  });

  it('returns type and value for character rules', () => {
    vi.mocked(isRuleChar).mockReturnValue(true);
    const rule: RuleChar = { type: RuleType.CHAR, value: [97] };
    expect(getSerializedRuleKey(rule)).toBe(`${KEY_TRANSLATION[RuleType.CHAR]}-[97]`);
  });

  it('returns type and value for character rules', () => {
    const rule: RuleCharExclude = { type: RuleType.CHAR_EXCLUDE, value: [97] };
    vi.mocked(isRuleCharExcluded).mockReturnValue(true);
    expect(getSerializedRuleKey(rule)).toBe(`${KEY_TRANSLATION[RuleType.CHAR_EXCLUDE]}-[97]`);
  });

  it('returns ref type with value for reference rules', () => {
    const rule: RuleRef = new RuleRef(99);
    vi.mocked(isRuleRef).mockReturnValue(true);
    expect(getSerializedRuleKey(rule)).toBe(`3-99`);
  });

  it('throws an error for unknown rule types', () => {
    const rule = { type: 'UNKNOWN', value: 'something' };
    expect(() => getSerializedRuleKey(rule as unknown as RuleRef)).toThrow('Unknown rule type: {"type":"UNKNOWN","value":"something"}');
  });
});
