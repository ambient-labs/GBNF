import {
  describe,
  test,
  expect,
} from 'vitest';
import JSON2GBNF, { JSONSchema } from "../../src/index.js";
import GBNF, {
  InputParseError,
} from 'gbnf';

/**
 * We test the following schemas:
 * 
 * - true, null, {} - test that the "any" case works
 * - arrays (base, and more specific)
 * - objects (base, and more specific)
 * 
 * Strings, numbers, booleans, and nulls don't need explicit whitespace testing, as they're not allowed to have any.
 */

describe('Whitespace', () => {
  describe('default', () => {
    const whitespace = 'default';
    test.each([
      ...([
        true,
        null,
        {},
      ] as JSONSchema[]).reduce<[JSONSchema, string][]>((acc, schema) => ([
        ...acc,
        ...[
          '1',
          '"foo"',
          '[1,2,3]',
          '[1, 2, 3]',
          '{"foo":1}',
          '{"foo": 1}',
          '{"foo":1,"bar":2}',
          '{"foo": 1,"bar": 2}',
          '{"foo": 1, "bar": 2}',
          "true",
          "false",
          "null",
        ].map(value => [schema, value] as [JSONSchema, string]),
      ]), []),
      ...[
        '[1,2,3]',
        '[1, 2, 3]',
      ].map(value => ([
        { type: 'array' },
        value,
      ]) as [JSONSchema, string]),
      ...[
        '{"foo":1}',
        '{"foo": 1}',
        '{"foo":1,"bar":2}',
        '{"foo": 1,"bar": 2}',
        '{"foo": 1, "bar": 2}',
      ].map(value => ([
        { type: 'object' },
        value,
      ]) as [JSONSchema, string]),
    ])(`${whitespace} whitespace, schema '%s' for string '%s'`, (schema, _initial) => {
      const grammar = JSON2GBNF(schema, {
        whitespace,
      });
      let parser = GBNF(grammar);
      const initial = _initial.split('\\n').join('\n').split('\\t').join('\t')
      parser = parser.add(initial);
      expect(parser.size).toBeGreaterThan(0);
    });

    test.each([
      ...([
        true,
        null,
        {},
      ] as JSONSchema[]).reduce<[JSONSchema, string, number][]>((acc, schema) => ([
        ...acc,
        ...[
          [4, '[1,  2,  3]',],
          [3, '[1,\\n\\n2, \\n 3]',],
          [8, '{"foo":   1}',],
          [10, '{"foo":1,  "bar": 2}',],
          [11, '{"foo": 1, \\n "bar": \\n2}',],
        ].map(([errorPos, value]) => [schema, value, errorPos] as [JSONSchema, string, number]),
      ]), []),
      ...[
        [4, '[1,  2,  3]',],
        [3, '[1,\\n\\n2, \\n 3]',],
      ].map(([errorPos, value]) => ([
        { type: 'array' },
        value,
        errorPos,
      ]) as [JSONSchema, string, number]),
      ...[
        [8, '{"foo":   1}',],
        [10, '{"foo":1,  "bar": 2}',],
        [11, '{"foo": 1, \\n "bar": \\n2}',],
      ].map(([errorPos, value]) => ([
        { type: 'object' },
        value,
        errorPos,
      ]) as [JSONSchema, string, number]),
    ])(`${whitespace} whitespace, rejects unnecessary whitespace for schema '%s' and string '%s'`, (schema, initial, errorPos) => {
      const grammar = JSON2GBNF(schema, {
        whitespace,
      });
      let parser = GBNF(grammar);
      expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
    });
  });

  describe('succinct', () => {
    const whitespace = 'succinct';
    test.each([
      ...([
        true,
        null,
        {},
      ] as JSONSchema[]).reduce<[JSONSchema, string][]>((acc, schema) => ([
        ...acc,
        ...[
          '1',
          '"foo"',
          '[1,2,3]',
          '{"foo":1}',
          '{"foo":1,"bar":2}',
          "true",
          "false",
          "null",
        ].map(value => [schema, value] as [JSONSchema, string]),
      ]), []),
      ...[
        '[1,2,3]',
      ].map(value => ([
        { type: 'array' },
        value,
      ]) as [JSONSchema, string]),
      ...[
        '{"foo":1}',
        '{"foo":1,"bar":2}',
      ].map(value => ([
        { type: 'object' },
        value,
      ]) as [JSONSchema, string]),
    ])(`${whitespace} whitespace, schema '%s' for string '%s'`, (schema, _initial) => {
      const grammar = JSON2GBNF(schema, {
        whitespace,
      });
      let parser = GBNF(grammar);
      const initial = _initial.split('\\n').join('\n').split('\\t').join('\t')
      parser = parser.add(initial);
      expect(parser.size).toBeGreaterThan(0);
    });

    test.each([
      ...([
        true,
        null,
        {},
      ] as JSONSchema[]).reduce<[JSONSchema, string, number][]>((acc, schema) => ([
        ...acc,
        ...[
          [3, '[1, 2, 3]',],
          [7, '{"foo": 1}',],
          [7, '{"foo": 1,"bar": 4}',],
          [7, '{"foo": 1, "bar": 5}',],
          [3, '[1,  8,  3]',],
          [3, '[1,\\n\\n2, \\n 3]',],
          [7, '{"foo":   1}',],
          [9, '{"foo":1,  "bar": 3}',],
          [7, '{"foo": 9, \\n "bar": \\n8}',],
        ].map(([errorPos, value]) => [schema, value, errorPos] as [JSONSchema, string, number]),
      ]), []),
      ...[
        [3, '[1,  9,  3]',],
        [3, '[1,\\n\\n2, \\n 3]',],
      ].map(([errorPos, value]) => ([
        { type: 'array' },
        value,
        errorPos,
      ]) as [JSONSchema, string, number]),
      ...[
        [7, '{"foo": 1}',],
        [7, '{"foo": 1,"bar": 8}',],
        [7, '{"foo": 1, "bar": 7}',],
        [7, '{"foo":   1}',],
        [9, '{"foo":1,  "bar": 6}',],
        [7, '{"foo": 1, \\n "bar": \\n2}',],
      ].map(([errorPos, value]) => ([
        { type: 'object' },
        value,
        errorPos,
      ]) as [JSONSchema, string, number]),
    ])(`${whitespace} whitespace, rejects unnecessary whitespace for schema '%s' and string '%s'`, (schema, initial, errorPos) => {
      const grammar = JSON2GBNF(schema, {
        whitespace,
      });
      let parser = GBNF(grammar);
      expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
    });
  });

  describe('verbose', () => {
    const whitespace = 'verbose';
    test.each([
      ...([
        true,
        null,
        {},
      ] as JSONSchema[]).reduce<[JSONSchema, string][]>((acc, schema) => ([
        ...acc,
        ...[
          '1',
          '"foo"',
          '[1,2,3]',
          '[1, 2, 3]',
          '{"foo":1}',
          '{"foo": 1}',
          '{"foo":1,"bar":2}',
          '{"foo": 1,"bar": 2}',
          '{"foo": 1, "bar": 2}',
          "true",
          "false",
          "null",
          '[1,  2,  3]',
          '[1,\\n\\n2, \\n 3]',
          '{"foo":   1}',
          '{"foo":1,  "bar": 2}',
          '{"foo": 1, \\n "bar": \\n2}',
        ].map(value => [schema, value] as [JSONSchema, string]),
      ]), []),
      ...[
        '[1,2,3]',
        '[1, 2, 3]',
        '[1,  2,  3]',
        '[1,\\n\\n2, \\n 3]',
      ].map(value => ([
        { type: 'array' },
        value,
      ]) as [JSONSchema, string]),
      ...[
        '{"foo":1}',
        '{"foo": 1}',
        '{"foo":1,"bar":2}',
        '{"foo": 1,"bar": 2}',
        '{"foo": 1, "bar": 2}',
        '{"foo":   1}',
        '{"foo":1,  "bar": 2}',
        '{"foo": 1, \\n "bar": \\n2}',
      ].map(value => ([
        { type: 'object' },
        value,
      ]) as [JSONSchema, string]),
    ])(`${whitespace} whitespace, schema '%s' for string '%s'`, (schema, _initial) => {
      const grammar = JSON2GBNF(schema, {
        whitespace,
      });
      let parser = GBNF(grammar);
      const initial = _initial.split('\\n').join('\n').split('\\t').join('\t')
      parser = parser.add(initial);
      expect(parser.size).toBeGreaterThan(0);
    });
  });
});
