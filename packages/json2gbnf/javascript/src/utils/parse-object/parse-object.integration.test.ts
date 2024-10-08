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
import { JSONSchema, JSONSchemaObject } from '../../types.js';
import {
  parseType,
} from '../parse-type.js';
import type * as _parseType from '../parse-type.js';
import {
  g,
} from 'gbnf/builder';
import {
  OPT_WS,
  WS
} from '../../constants.js';
import GBNF from 'gbnf';

vi.mock('../parse-type.js', async () => {
  const actual = await vi.importActual('../parse-type.js') as typeof _parseType;
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

  describe('no additionalProperties', () => {
    test.each([
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

    test.each([
      ['{"bar":123,"baz": "foo"}'],
    ])('should throw if given an invalid input', (initial) => {
      // TODO
      const schema: JSONSchemaObject =
      {
        type: 'object',
        additionalProperties: false,
        properties: {
          number: { type: 'number' },
          street_name: { type: 'string' },
          street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
        },
        required: ['street_name'],
      }
        ;
      const rule = parseObject(schema).toString({
        include,
      });
      expect(() => GBNF(rule, initial)).toThrow();
    });

    test.each([
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
    ])('it should parse a schema with two properties and no additional properties for "%s"', (initial) => {
      const schema: JSONSchemaObject = {
        type: 'object',
        properties: {
          foy: { type: 'string', },
          bar: { type: 'number', },
        },
        additionalProperties: false,
      };
      expect(() => {
        const grammar = parseObject(schema).toString({
          include,
        });
        // console.log(grammar);
        GBNF(grammar, initial);
      }).not.toThrow();
    });

    test.each([
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
    ])('it should parse a schema with two properties, no additional properties, and required properties "foo" for "%s"', (initial) => {
      const schema: JSONSchemaObject = {
        type: 'object',
        properties: {
          foo: { type: 'string', },
          bar: { type: 'number', },
        },
        additionalProperties: false,
        required: ['foo'],
      };
      expect(() => {
        const grammar = parseObject(schema).toString({
          include,
        });
        // console.log(grammar);
        GBNF(grammar, initial);
      }).not.toThrow();
    });
  });

  describe('additionalProperties', () => {
    test.each([
      '{"bax"',
      '{"fox":"',
      '{"foo":"por",',
      '{"foo":"baz","baz":"qux","poo":123,"bar":123}',
    ])('it should parse an object with no properties and additional properties allowed for "%s"', (initial) => {
      const schema: JSONSchemaObject = {
        type: 'object',
        properties: {},
        additionalProperties: true,
      };
      expect(() => {
        const grammar = parseObject(schema).toString({
          include,
        });
        // console.log(grammar);
        GBNF(grammar, initial);
      }).not.toThrow();
    });

    test.each([
      '{',
      '{"',
      '{"bay"',
    ])('it should parse an object with 1 property and additional properties allowed for "%s"', (initial) => {
      const schema: JSONSchemaObject = {
        type: 'object',
        properties: {
          foo: { type: 'string', },
        },
        additionalProperties: true,
      };
      expect(() => {
        const grammar = parseObject(schema).toString({
          include,
        });
        // console.log(grammar);
        GBNF(grammar, initial);
      }).not.toThrow();
    });

    test.each([
      '{',
      '{"',
      '{"bay"',
      '{"bay":',
      '{"bayy":"',
      '{"bay":"baz',
      '{"bay":"baz","baz":"qux"',
      '{"foo":"baz","baz":"qux","pop":123,"bar":123}',
    ])('it should parse an object with 2 properties and additional properties allowed for "%s"', (initial) => {
      const schema: JSONSchemaObject = {
        type: 'object',
        properties: {
          foo: { type: 'string', },
          bar: { type: 'number', },
        },
        additionalProperties: true,
      };
      expect(() => {
        const grammar = parseObject(schema).toString({
          include,
        });
        // console.log(grammar);
        GBNF(grammar, initial);
      }).not.toThrow();
    });
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

});
