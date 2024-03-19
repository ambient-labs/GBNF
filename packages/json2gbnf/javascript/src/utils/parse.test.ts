import {
  describe,
  test,
  expect,
  vi,
  afterEach,
} from 'vitest';
import { parse, } from './parse.js';
import { JSONSchema, } from '../types.js';
import {
  parsePrimitives,
} from './parse-primitives.js';
import type * as _parsePrimitives from './parse-primitives.js';
import {
  parseType,
} from './parse-type.js';
import type * as _parseType from './parse-type.js';
import {
  isSchemaConst,
  isSchemaEnum,
  isSchemaMultiplePrimitiveTypes,
} from '../type-guards.js';
import type * as _typeGuards from '../type-guards.js';
import {
  parseEnum,
} from './parse-enum.js';
import type * as _parseEnum from './parse-enum.js';
import {
  parseConst,
} from './parse-const.js';
import type * as _parseConst from './parse-const.js';
import {
  Grammar
} from '../grammar.ts.bl';
import {
  _,
} from 'gbnf/builder';

vi.mock('../type-guards.js', async () => {
  const actual = await vi.importActual('../type-guards.js') as typeof _typeGuards;
  return {
    ...actual,
    isSchemaConst: vi.fn(),
    isSchemaEnum: vi.fn(),
    isSchemaMultiplePrimitiveTypes: vi.fn(),
  };
});

vi.mock('./parse-type.js', async () => {
  const actual = await vi.importActual('./parse-type.js') as typeof _parseType;
  return {
    ...actual,
    parseType: vi.fn((schema: any) => 'parsedType'),
  };
});

vi.mock('./parse-enum.js', async () => {
  const actual = await vi.importActual('./parse-enum.js') as typeof _parseEnum;
  return {
    ...actual,
    parseEnum: vi.fn(),
  };
});

vi.mock('./parse-const.js', async () => {
  const actual = await vi.importActual('./parse-const.js') as typeof _parseConst;
  return {
    ...actual,
    parseConst: vi.fn(),
  };
});

vi.mock('./parse-primitives.js', async () => {
  const actual = await vi.importActual('./parse-primitives.js') as typeof _parseConst;
  return {
    ...actual,
    parsePrimitives: vi.fn(),
  };
});

describe('parse fn', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  test('should parse primitive schema', () => {
    vi.mocked(isSchemaMultiplePrimitiveTypes).mockReturnValueOnce(true);
    const schema: JSONSchema = {
      type: ['string', 'number',],
    };
    parse(schema);
    expect(parsePrimitives).toHaveBeenCalledWith(schema);
  });

  test('should parse enum schema', () => {
    vi.mocked(isSchemaEnum).mockReturnValueOnce(true);
    const schema: JSONSchema = {
      enum: ['foo', 'bar', null,],
    };
    parse(schema);
    expect(parseEnum).toHaveBeenCalledWith(schema);
  });

  test('should parse const schema', () => {
    vi.mocked(isSchemaConst).mockReturnValueOnce(true);
    const schema: JSONSchema = {
      const: 'foo',
    };
    parse(schema);
    expect(parseConst).toHaveBeenCalledWith(schema);
  });

  test('should parse type', () => {
    const schema: JSONSchema = {
      const: 'foo',
    };
    parse(schema);
    expect(parseType).toHaveBeenCalledWith(schema, undefined);
  });

});
