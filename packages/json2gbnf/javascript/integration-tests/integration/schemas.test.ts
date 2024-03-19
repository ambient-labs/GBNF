import {
  describe,
  expect,
  test,
} from 'vitest';
import JSON2GBNF, {
  JSONSchema
} from "../../src/index.js";
import GBNF from 'gbnf';

describe('schema', () => {
  test.each([
    ...([true, null, {}] as JSONSchema[]).reduce<[JSONSchema, unknown][]>((acc, schema) => {
      for (const val of [
        1,
        'foo',
        [1, 2, 3],
        { foo: 'bar' },
        true,
        false,
        null,
      ]) {
        acc.push([schema, val]);
      }
      return acc;
    }, []),
    ...([
      ['foo',],
      ["fo", { minLength: 2 },],
      ["foo", { minLength: 2 },],
      ["foo", { maxLength: 3 },],
      ["fo", { minLength: 2, maxLength: 3 }],
      ["foo", { minLength: 2, maxLength: 3 }],
    ] as [string, undefined | Record<string, number>][]).map(([val, schema = {}]) => ([
      {
        type: 'string',
        ...schema,
      },
      val,
    ])),
    ...[
      123,
      -123.001,
    ].map((val) => ([{ type: 'number' }, val,])),
    ...[
      123,
      123.0,
      -123.0,
    ].map((val) => ([{ type: 'integer' }, val,])),
    ...[
      true,
      false,
    ].map((val) => ([{ type: 'boolean' }, val,])),
    ...[
      null,
    ].map((val) => ([{ type: 'null' }, val,])),
    ...[
      [{}, []],
      [{}, [1, 2, 3]],
      [{}, [1, 'foo', true, null, undefined, {}, []]],
      [{ items: { type: 'number', } }, [1, 2, 3]],
      [{ items: { type: 'number', } }, []],
      [{ items: { type: 'string', } }, ['1', '2', 'baz',]],
      [{ items: { type: ['string', 'number'], } }, ['foo', 2, 'bar',]],
    ].map(([schema, val]) => ([{ type: 'array', ...schema }, val,])),
    ...[
      {},
      { foo: 'foo', },
      { foo: [1, 2, 3], },
      { foo: 123, bar: 'foo', baz: null, qux: undefined, },
    ].map((val) => ([{ type: 'object' }, val,])),

    [{ const: "fxy" }, 'fxy'],

    ...[
      'red',
      null,
      42,
    ].map((val) => ([{ enum: ['red', null, 42] }, val,])),


    ...[
      [['string'], 'foo'],
      [['string', 'number'], 'foo'],
      [['string', 'number'], 1],
      [['string', 'number', 'boolean'], 'foo'],
      [['string', 'number', 'boolean'], 1],
      [['string', 'number', 'boolean'], true],
      [['string', 'number', 'boolean'], false],
      [['string', 'number', 'boolean', 'null'], null],
      [['string', 'number', 'boolean', 'null', 'array'], [1, 2, 9]],
      [['string', 'number', 'boolean', 'null', 'array', 'object'], {}],
    ].map(([type, val]) => ([{ type }, val,])),

    ...[
      [{}, {},],
      [{}, { "number": 1600, "street_name": "Pennsylvania", "street_type": "Avenue" },],
      [{}, { "number": 10.1, "street_name": "Foo", "street_type": "Boulevard" },],
      [{}, { "street_name": "Foo", "number": 10.1, },],
      [{}, { "number": 10.1, "street_name": "Foo", "street_type": "Boulevard" },],
      [
        {
          required: ['number', 'street_type']
        },
        { "number": 1600, "street_name": "Foo", "street_type": "Boulevard" },
      ],
      [
        {
          required: ['number', 'street_type']
        },
        { "number": 1600, "street_type": "Boulevard" },
      ],
      // additionalProperties being true
      [
        {
          additionalProperties: true,
        },
        { "number": 1600, "street_name": "Foo", "street_type": "Boulevard" },
      ],
      [
        {
          additionalProperties: true,
        },
        { "number": 1600, "street_name": "Foo", "street_type": "Boulevard", "zipcode": 12345 },
      ],
      // additionalProperties being true and requirements being true
      [
        {
          additionalProperties: true,
          required: ['number', 'street_type'],
        },
        { "number": 1600, "foo": "Foo", "street_type": "Boulevard" },
      ],
      [
        {
          properties: {
            number: {
              type: 'number',
            },
            country: {
              const: 'USA',
            }
          }
        },
        { "number": 1600, "country": "USA", },
      ],
      [
        {
          properties: {
            number: {
              type: 'number',
            },
            country: {
              const: 'USA',
            }
          }
        },
        { "country": "USA", "number": 1600, },
      ],
    ].map(([schema, val]) => ([{
      type: 'object',
      additionalProperties: false,
      properties: {
        number: { type: 'number' },
        street_name: { type: 'string' },
        street_type: { enum: ['Street', 'Avenue', 'Boulevard'] },
      },
      ...schema
    }, val,])),
  ] as [undefined | JSONSchema, unknown][])('it parses schema "%s" for input "%s"', (schema, initial) => {
    expect(() => {
      const grammar = JSON2GBNF(schema);
      // console.log(grammar);
      return GBNF(grammar, JSON.stringify(initial));
    }).not.toThrow();
  });
});
