import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  g,
} from 'gbnf/builder';
import {
  quoteRule,
} from '../../constants.js';
import { getPropertiesValue, } from './get-properties-value.js';
import { getPropertyKeysFromSchema } from './get-property-keys-from-schema.js';
import { JSONSchemaObjectWithProperties } from '../../types.js';


describe('getPropertyKeysFromSchema', () => {
  test('should return the property keys from the schema', () => {
    const schema = {
      properties: {
        foo: { type: 'string' },
        bar: { type: 'number' },
        baz: { type: 'boolean' },
      },
    };
    const expected = [
      { key: 'foo', rule: g` ${quoteRule} ${`"foo"`} ${quoteRule} ":"  ${getPropertiesValue({ type: 'string', })} `.toString(), },
      { key: 'bar', rule: g` ${quoteRule} ${`"bar"`} ${quoteRule} ":"  ${getPropertiesValue({ type: 'number', })} `.toString(), },
      { key: 'baz', rule: g` ${quoteRule} ${`"baz"`} ${quoteRule} ":"  ${getPropertiesValue({ type: 'boolean', })} `.toString(), },
    ];
    const keys = getPropertyKeysFromSchema(schema as unknown as JSONSchemaObjectWithProperties).map(({ key, rule }) => ({ key, rule: rule.toString() }));
    expect(keys).toEqual(expected);
  });
});
