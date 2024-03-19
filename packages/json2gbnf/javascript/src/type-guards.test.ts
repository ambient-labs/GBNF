import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  isEmptyObject,
  isSchemaConst,
  isSchemaEnum,
  isSchemaMultiplePrimitiveTypes,
  isSchemaObject,
} from "./type-guards.js";

describe('types', () => {
  describe('isSchemaMultipleBasicTypes', () => {
    test('it returns true if given a schema with a type array', () => {
      expect(isSchemaMultiplePrimitiveTypes({ type: ['string', 'number', 'boolean', 'null', 'object', 'array'] })).toEqual(true);
    });

    test('it returns false if not given a schema with a type array', () => {
      expect(isSchemaMultiplePrimitiveTypes({ type: 'string' })).toEqual(false);
    });
  });

  describe('isSchemaEnum', () => {
    test('it returns true if given a schema with an enum', () => {
      expect(isSchemaEnum({ enum: ['foo', 'bar'] })).toEqual(true);
    });

    test('it returns false if not given a schema with an enum', () => {
      expect(isSchemaEnum({ type: 'string' })).toEqual(false);
    });
  });

  describe('isSchemaConst', () => {
    test('it returns true if given a schema with a const', () => {
      expect(isSchemaConst({ const: 'foo' })).toEqual(true);
    });

    test('it returns false if not given a schema with a const', () => {
      expect(isSchemaConst({ type: 'string' })).toEqual(false);
    });
  });

  describe('isSchemaObject', () => {
    test('it returns true if given a schema with a type object', () => {
      expect(isSchemaObject({ type: 'object' })).toEqual(true);
    });

    test('it returns false if not given a schema with a type object', () => {
      expect(isSchemaObject({ type: 'string' })).toEqual(false);
    });
  });

  describe('isEmptyObject', () => {
    test('it returns true if given an empty object', () => {
      expect(isEmptyObject({})).toEqual(true);
    });

    test('it returns false if not given an empty object', () => {
      expect(isEmptyObject({ type: 'string' })).toEqual(false);
    });
  });
});
