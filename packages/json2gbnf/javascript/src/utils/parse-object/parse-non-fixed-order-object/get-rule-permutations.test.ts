import {
  vi,
  describe,
  test,
  expect,
  afterEach,
  beforeEach,
} from 'vitest';
import { g } from 'gbnf';
import { getRulePermutations } from './get-rule-permutations.js';
import { getKeysWithAdditionalProperties } from './get-keys-with-additional-properties.js';
import * as _getKeysWithAdditionalProperties from './get-keys-with-additional-properties.js';

vi.mock('./get-keys-with-additional-properties.js', async () => {
  const actual = await vi.importActual('./get-keys-with-additional-properties.js') as typeof _getKeysWithAdditionalProperties;
  return {
    ...actual,
    getKeysWithAdditionalProperties: vi.fn().mockImplementation(actual.getKeysWithAdditionalProperties),
  };
});

describe('getRulePermutations', () => {
  beforeEach(() => {
    // vi.mocked(getKeysWithAdditionalProperties).mockImplementation(keys => keys);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('should return rule permutations with no additional properties and no required keys', () => {
    const keys = [{
      rule: g`"foo" ":" "bar"`,
    }];
    getRulePermutations(keys, false, []);
    expect(getKeysWithAdditionalProperties).toHaveBeenCalledWith(keys, false);
  });

  test('should return rule permutations with additional properties and no required keys', () => {
    const keys = [{
      rule: g`"foo" ":" "bar"`,
    }];
    getRulePermutations(keys, true, []);
    expect(getKeysWithAdditionalProperties).toHaveBeenCalledWith(keys, true);
  });

  describe('for a single key', () => {
    test('should return rule permutations with no required keys', () => {
      const keys = [{
        key: 'foo',
        rule: g`"foo" ":" "bar"`,
      }];
      const result = getRulePermutations(keys, false, []);
      expect(result).toMatchGBNF([
        g`${g`""`}`,
        g`"foo" ":" "bar"`,
      ]);
    });

    test('should return rule permutations with required keys', () => {
      const keys = [{
        key: 'foo',
        rule: g`"foo" ":" "foo"`,
      }];
      const result = getRulePermutations(keys, false, ['foo']);
      expect(result).toMatchGBNF([
        g`"foo" ":" "foo"`,
      ]);
    });
  });

  describe('for two keys', () => {
    test('should return rule permutations with no required keys', () => {
      const keys = [{
        key: 'foo',
        rule: g`"foo" ":" "foo"`,
      }, {
        key: 'bar',
        rule: g`"bar" ":" "bar"`,
      }];
      const result = getRulePermutations(keys, false, []);
      expect(result).toMatchGBNF([
        g`${g`""`}`,
        g`"foo" ":" "foo"`,
        g`${g`${g`"foo" ":" "foo"`} "," ${g`"bar" ":" "bar"`}`}`,
        g`"bar" ":" "bar"`,
        g`${g`${g`"bar" ":" "bar"`} "," ${g`"foo" ":" "foo"`}`}`,
      ]);
    });

    test('should return rule permutations with required keys', () => {
      const keys = [{
        key: 'foo',
        rule: g`"foo" ":" "foo"`,
      }, {
        key: 'bar',
        rule: g`"bar" ":" "bar"`,
      }];
      const result = getRulePermutations(keys, false, ['foo']);
      expect(result).toMatchGBNF([
        g`"foo" ":" "foo"`,
        g`${g`${g`"foo" ":" "foo"`} "," ${g`"bar" ":" "bar"`}`}`,
        g`${g`${g`"bar" ":" "bar"`} "," ${g`"foo" ":" "foo"`}`}`,
      ]);
    });
  });
});

