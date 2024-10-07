import { parseEnum, } from '../parse-enum.js';
import {
  JSONSchemaValue,
} from '../../types.js';
import { parseType, } from '../parse-type.js';
import {
  isSchemaConst,
  isSchemaEnum,
} from '../../type-guards.js';
import {
  parseConst,
} from '../parse-const.js';
import {
  GBNFRule,
} from 'gbnf/builder';

export const getPropertiesValue = (value: JSONSchemaValue): GBNFRule => {
  if (isSchemaConst(value)) {
    return parseConst(value);
  }
  if (isSchemaEnum(value)) {
    return parseEnum(value);
  }
  return parseType(value);
};

