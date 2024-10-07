import {
  describe,
  test,
  afterEach,
  it,
  expect,
  vi,
  beforeEach,
} from 'vitest';
import {
  parseObject,
} from './parse-object.js';
import { JSONSchemaObject } from '../types.js';
import {
  parseType,
} from './parse-type.js';
import type * as _parseType from './parse-type.js';
import {
  _,
} from 'gbnf/builder';
import {
  OPT_WS,
  WS
} from '../constants.js';
import GBNF from 'gbnf';

vi.mock('./parse-type.js', async () => {
  const actual = await vi.importActual('./parse-type.js') as typeof _parseType;
  return {
    ...actual,
    parseType: vi.fn(),
  };
});

const ws = g`[ \\t\\n\\r]`.key(WS);
const opt_ws = ws.wrap('?').key(OPT_WS);
const include = [opt_ws];

describe('parseObject', () => {
  beforeEach(() => {
    vi.mocked(parseType).mockImplementation((key) => {
      if (key.type === 'string') {
        return g`"\\"" [a-z]+ "\\"" `;
      }
      return g`[0-9]+`;
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  test(`it should parse an empty schema`, () => {
    const rule = parseObject({ type: 'object' });
    if (typeof rule === 'string') {
      throw new Error('Expected rule to be a GBNFRule');
    }
    expect(() => GBNF([
      rule.toString({
        include,
      }),
      `value ::= ""`,
    ].join('\n'), '{}')).not.toThrow();
  });

  test.each([
    ...[
      '{',
      '{}',
      '{"',
      '{"foy"',
      '{"foy":',
      '{"foy":"',
      '{"foy":"baz',
      '{"foy":"baz"',
      '{"foy":"baz",',
      '{"foy":"baz","bar"',
      '{"foy":"baz","bar":',
      '{"foy":"baz","bar":123',
      '{"foy":"baz","bar":123}',
      '{"bar"',
      '{"bar":',
      '{"bar":123',
      '{"bar":123,',
      '{"bar":123,"foy"',
      '{"bar":123,"foy":',
      '{"bar":123,"foy":"baz',
      '{"bar":123,"foy":"baz"',
      '{"bar":123,"foy":"baz"}',
      '{"foy":"baz"}',
      '{"bar":123}',
    ].map(val => ([
      {
        type: 'object',
        properties: {
          foy: { type: 'string', },
          bar: { type: 'number', },
        },
        additionalProperties: false,
      }, val,
    ])),
    ...[
      '{',
      '{"',
      '{"foo"',
      '{"foo":',
      '{"foo":"',
      '{"foo":"baz',
      '{"foo":"baz"',
      '{"foo":"baz",',
      '{"foo":"baz","bar"',
      '{"foo":"baz","bar":',
      '{"foo":"baz","bar":123',
      '{"foo":"baz","bar":123}',
      '{"bar"',
      '{"bar":',
      '{"bar":123',
      '{"bar":123,',
      '{"bar":123,"foo"',
      '{"bar":123,"foo":',
      '{"bar":123,"foo":"baz',
      '{"bar":123,"foo":"baz"',
      '{"bar":123,"foo":"baz"}',
      '{"foo":"baz"}',
    ].map(val => ([
      {
        type: 'object',
        properties: {
          foo: { type: 'string', },
          bar: { type: 'number', },
        },
        additionalProperties: false,
        requiredProperties: ['foo'],
      }, val,
    ])),
    ...[
      '{"bax"',
      '{"fox":"',
      '{"foo":"por",',
      '{"foo":"baz","baz":"qux","poo":123,"bar":123}',
    ].map(val => ([
      {
        type: 'object',
        properties: {},
        additionalProperties: true,
      }, val,
    ])),
    ...[
      '{',
      '{"',
      '{"bay"',
    ].map(val => ([
      {
        type: 'object',
        properties: {
          foo: { type: 'string', },
        },
        additionalProperties: true,
      }, val,
    ])),
    ...[
      '{',
      '{"',
      '{"bay"',
      '{"bay":',
      '{"bayy":"',
      '{"bay":"baz',
      '{"bay":"baz","baz":"qux"',
      '{"foo":"baz","baz":"qux","pop":123,"bar":123}',
    ].map(val => ([
      {
        type: 'object',
        properties: {
          foo: { type: 'string', },
          bar: { type: 'number', },
        },
        additionalProperties: true,
      }, val,
    ])),
  ] as [JSONSchemaObject, string][])(`it should parse '%s' for '%s'`, (schema, initial) => {
    const rule = parseObject(schema);
    if (typeof rule === 'string') {
      throw new Error('Expected rule to be a GBNFRule');
    }
    expect(() => {
      const grammar = rule.toString({
        include,
      });
      // console.log(grammar);
      GBNF(grammar, initial);
    }).not.toThrow();
  });


  test.each([
    [{ type: 'object' }, '{}'],
    ...[
      '{',
      '{}',
      '{"foo":"a","qrx":1}',
      '{"qrx":1}',
    ].map(val => ([
      {
        type: 'object',
        properties: {
          foo: { type: 'string', },
          bar: { type: 'number', },
          baz: { type: 'number', },
          qrx: { type: 'number', },
        },
        additionalProperties: false,
      },
      val,
    ])),
    ...[
      '{',
      '{}',
      '{"foo"',
      '{"foo":',
      '{"foo":"baz"',
      '{"foo":"baz",',
      '{"foo":"baz","bar"',
      '{"foo":"baz","bar":',
      '{"foo":"baz","bar":123',
      '{"foo":"baz","bar":123}',
    ].map(val => ([
      {
        type: 'object',
        properties: {
          foo: { type: 'string', },
          bar: { type: 'number', },
        },
        additionalProperties: false,
      },
      val,
    ])),
  ] as [JSONSchemaObject, string][])(`it should parse fixed order for '%s' for '%s'`, (schema, initial) => {
    const rule = parseObject(schema, true);
    if (typeof rule === 'string') {
      throw new Error('Expected rule to be a GBNFRule');
    }
    const grammar = rule.toString({
      include
    });
    // console.log(grammar);
    expect(() => GBNF([
      grammar,
      `value ::= ""`,
    ].join('\n'), initial)).not.toThrow();
  });

  it('should throw an error if an unsupported key is present', () => {
    const schema = { patternProperties: {}, } as JSONSchemaObject;
    expect(() => parseObject(schema)).toThrowError(
      'patternProperties is not supported',
    );
  });

  it.each([
    [['foo'], '{"bar":123}'],
    [['bar'], '{"foo":"foo"}'],
  ])('should throw if a required property is not present', (required, initial) => {
    const schema: JSONSchemaObject = {
      type: 'object',
      properties: {
        foo: { type: 'string', },
        bar: { type: 'number', },
      },
      additionalProperties: false,
      required,
    };
    const rule = parseObject(schema).toString({
      include,
    });
    expect(() => GBNF(rule, initial)).toThrow();
  });

  it.each([
    ['{"bar":123,"baz": "foo"}'],
  ])('should throw if additional properties are not allowed', (initial) => {
    const schema: JSONSchemaObject = {
      type: 'object',
      properties: {
        foo: { type: 'string', },
        bar: { type: 'number', },
      },
      additionalProperties: false,
    };
    const rule = parseObject(schema).toString({
      include,
    });
    expect(() => GBNF(rule, initial)).toThrow();
  });

});
