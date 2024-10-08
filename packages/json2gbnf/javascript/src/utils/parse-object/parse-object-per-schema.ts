import {
  JSONSchemaObjectWithProperties,
} from '../../types.js';
import {
  GBNFRule,
} from 'gbnf/builder';
import { parseFixedOrderObject, } from './parse-fixed-order-object/parse-fixed-order-object.js';
import { parseNonFixedOrderObject, } from './parse-non-fixed-order-object/parse-non-fixed-order-object.js';
import { getPropertyKeysFromSchema, } from './get-property-keys-from-schema.js';

export const parseObjectPerSchema = (schema: JSONSchemaObjectWithProperties, fixedOrder?: boolean): GBNFRule => {
  const keys = getPropertyKeysFromSchema(schema);
  if (fixedOrder) {
    return parseFixedOrderObject(keys);
  }
  return parseNonFixedOrderObject(schema, keys);
};
