import {
  JSONSchemaObjectWithProperties,
} from '../../types.js';
import {
  g,
} from 'gbnf/builder';
import {
  quoteRule,
} from '../../constants.js';
import { ObjectEntry, } from './types.js';
import { getPropertiesValue, } from './get-properties-value.js';

export const getPropertyKeysFromSchema = (schema: JSONSchemaObjectWithProperties): ObjectEntry[] => {
  return Object.entries(schema.properties).map(([key, value,]) => ({
    key,
    rule: g` ${quoteRule} ${`"${key}"`} ${quoteRule} ":"  ${getPropertiesValue(value)} `,
  }));
};
