import {
  describe,
  test,
  expect,
  afterEach,
  vi,
} from 'vitest';
import { hydrateVariables } from './hydrate-variables';

describe('hydrateVariables', () => {
  test('it throws if encountering a variable without a definition', () => {
    expect(() => hydrateVariables('$foo', {})).toThrow();
  });

  test('it should replace variables with their values', () => {
    expect(hydrateVariables([
      `test('foo', () => {`,
      ` expect($bar).toBe($baz);`,
      `});`,
    ], {
      bar: JSON.stringify('bar'),
      baz: JSON.stringify('baz'),
    })).toEqual([
      `test('foo', () => {`,
      ` expect("bar").toBe("baz");`,
      `});`,
    ]);
  });

  test('it should replace variables of the same name with their values', () => {
    expect(hydrateVariables([
      `test('foo', () => {`,
      ` expect($bar).toBe($bar);`,
      `});`,
    ], {
      bar: JSON.stringify('bar'),
      baz: JSON.stringify('baz'),
    })).toEqual([
      `test('foo', () => {`,
      ` expect("bar").toBe("bar");`,
      `});`,
    ]);
  });

  test('it should handle variables of all types', () => {
    expect(hydrateVariables([
      `test('foo', () => {`,
      ` console.log($str);`,
      ` console.log($int);`,
      ` console.log($float);`,
      ` console.log($bool);`,
      ` console.log($null);`,
      ` console.log($undefined);`,
      ` console.log($array);`,
      ` console.log($object);`,
      `});`,
    ], {
      str: JSON.stringify('str'),
      int: 1,
      float: 1.23,
      bool: true,
      null: null,
      undefined: undefined,
      array: [1, 2, 3],
      object: { foo: 'bar' },
    })).toEqual([
      `test('foo', () => {`,
      ` console.log("str");`,
      ` console.log(1);`,
      ` console.log(1.23);`,
      ` console.log(true);`,
      ` console.log(null);`,
      ` console.log(undefined);`,
      ` console.log([1,2,3]);`,
      ` console.log({"foo":"bar"});`,
      `});`,
    ]);
  });
});
