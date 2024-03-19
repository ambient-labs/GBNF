import {
  describe,
  test,
  it,
  expect
} from 'vitest';
import { parseEnum } from './parse-enum.js';
import { QUOTE_KEY } from '../constants/grammar-keys.js';
import { JSONSchemaObjectValueEnum } from '../types.js';
import GBNF from 'gbnf';

describe('parseEnum', () => {
  const testCases = [
    ['foo'],
    ['foo', 'boz',],
    ['foo', 'bar', 'baz'],
    ['foo', 'bar', 'baz!@#$%^&*()'],
    ['foo', 42, null, true, false],
  ].reduce<[JSONSchemaObjectValueEnum, unknown][]>((
    acc,
    enums,
  ) => acc.concat(enums.map(value => ([
    { enum: enums, }, value,
  ]))), []);
  test.each(testCases)(`should parse schema '%s' for string '%s'`, (schema, initial) => {
    expect(() => {
      const grammar = parseEnum(schema).compile();
      GBNF(grammar, JSON.stringify(initial));
    }).not.toThrow();
  });

  test('it throws if given an empty enum', () => {
    expect(() => {
      parseEnum({ enum: [] });
    }).toThrow();
  });
});
