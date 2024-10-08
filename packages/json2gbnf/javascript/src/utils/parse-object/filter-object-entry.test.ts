import { filterObjectEntry } from "./filter-object-entry";

import {
  describe,
  test,
  expect,
} from 'vitest';

describe('filterObjectEntry', () => {
  test('should return true if the key is in the permutation', () => {
    const permutation = [{ key: 'bar', }, { key: 'foo' }];
    const key = 'foo';
    expect(filterObjectEntry(permutation, key)).toBe(true);
  });

  test('should return false if the key is not in the permutation', () => {
    const permutation = [{ key: 'bar', }, { key: 'foo' }];
    const key = 'baz';
    expect(filterObjectEntry(permutation, key)).toBe(false);
  });
});

