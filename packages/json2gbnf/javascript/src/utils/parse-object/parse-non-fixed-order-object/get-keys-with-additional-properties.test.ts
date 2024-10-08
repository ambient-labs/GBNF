import {
  vi,
  describe,
  test,
  expect,
} from 'vitest';
import { g } from 'gbnf';
import {
  anyObjectEntry,
  getKeysWithAdditionalProperties
} from './get-keys-with-additional-properties';

describe('getKeysWithAdditionalProperties', () => {
  test('should return keys with additional properties', () => {
    const keys = [{
      rule: g`"foo" ":" "bar"`,
    }];
    const result = getKeysWithAdditionalProperties(keys, true);
    expect(result.map(r => r.rule)).toMatchGBNF([
      ...keys,
      {
        rule: g` ${anyObjectEntry} ${g`"," ${anyObjectEntry}`.wrap('*')}`.wrap('?'),
      },
    ].map(r => r.rule));
  });

  test('should return keys without additional properties', () => {
    const keys = [{
      rule: g`"foo" ":" "bar"`,
    }];
    const result = getKeysWithAdditionalProperties(keys, false);
    expect(result.map(r => r.rule)).toMatchGBNF([
      ...keys,
    ].map(r => r.rule));
  });
});
