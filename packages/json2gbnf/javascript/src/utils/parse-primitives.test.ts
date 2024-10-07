import {
  describe,
  test,
  expect,
} from 'vitest';
import { parsePrimitives } from './parse-primitives.js';
import { JSONSchemaMultiplePrimitiveTypes } from '../types.js';
import {
  arrRule,
  boolRule,
  nullRule,
  numRule,
  objRule,
  strRule
} from '../constants.js';

import {
  _,
} from 'gbnf/builder';
import {
  OPT_WS,
  WS
} from '../constants.js';

const ws = _`[ \\t\\n\\r]`.key(WS);
const opt_ws = ws.wrap('?').key(OPT_WS);

const include = [opt_ws];

describe('Multiple Primitives', () => {
  test('should parse schema with a handful of primitives', () => {
    const schema: JSONSchemaMultiplePrimitiveTypes = {
      type: ['string', 'number',],
    };
    const rule = parsePrimitives(schema);
    expect(rule.compile({
      include,
    })).toEqual(_`${[strRule, numRule]}`.join(' | ').compile({
      include,
    }));
  });

  test('should parse schema with all primitives', () => {
    const schema: JSONSchemaMultiplePrimitiveTypes = {
      type: ['string', 'number', 'boolean', 'null', 'object', 'array',],
    };
    const rule = parsePrimitives(schema);
    expect(rule.compile({
      include,
    })).toEqual(_`${[strRule, numRule, boolRule, nullRule, objRule(), arrRule()]}`.join(' | ').compile({
      include,
    }));
  });

  test('should throw an error for unknown types', () => {
    const schema: JSONSchemaMultiplePrimitiveTypes = {
      type: ['unknown' as any],
    };
    expect(() => {
      parsePrimitives(schema);
    }).toThrowError(new Error('Unknown type unknown for schema {"type":["unknown"]}'));
  });
})
