import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  getAllPermutations
} from './get-all-permutations.js';

describe('getAllPermutations', () => {
  test('it returns an empty array when given an empty array', () => {
    expect(getAllPermutations([])).toEqual([]);
  });

  test('it returns an array with a single empty array when given an empty array and no required elements', () => {
    expect(getAllPermutations([], undefined, [])).toEqual([]);
  });

  test('it returns all permutations of a single element array', () => {
    expect(getAllPermutations(['a'])).toEqual([['a']]);
  });

  test('it returns all permutations of a two element array', () => {
    expect(getAllPermutations(['a', 'b'])).toEqual([
      ['a'],
      ['a', 'b'],
      ['b'],
      ['b', 'a'],
    ]);
  });

  test('it returns all permutations of a three element array', () => {
    expect(getAllPermutations(['a', 'b', 'c'])).toEqual([
      ['a'],
      ['a', 'b'],
      ['a', 'b', 'c'],
      ['a', 'c'],
      ['a', 'c', 'b'],
      ['b'],
      ['b', 'a'],
      ['b', 'a', 'c'],
      ['b', 'c'],
      ['b', 'c', 'a'],
      ['c'],
      ['c', 'a'],
      ['c', 'a', 'b'],
      ['c', 'b'],
      ['c', 'b', 'a'],
    ]);
  });

  describe('required', () => {
    const filter = (p, key) => p.includes(key);
    test('it filters permutations based on required elements', () => {
      expect(getAllPermutations(['a', 'b', 'c'], filter, ['a', 'c'])).toEqual([
        ['a', 'b', 'c'],
        ['a', 'c'],
        ['a', 'c', 'b'],
        ['b', 'a', 'c'],
        ['b', 'c', 'a'],
        ['c', 'a'],
        ['c', 'a', 'b'],
        ['c', 'b', 'a'],
      ]);
    });

    test('it returns an empty array when no permutations match the required elements', () => {
      expect(getAllPermutations(['a', 'b'], filter, ['c'])).toEqual([]);
    });

    test('it returns all permutations when required elements is an empty array', () => {
      expect(getAllPermutations(['a', 'b'], filter, [])).toEqual([
        ['a'],
        ['a', 'b'],
        ['b'],
        ['b', 'a'],
      ]);
    });

    test('it returns all permutations when all elements are required', () => {
      expect(getAllPermutations(['a', 'b'], filter, ['a', 'b'])).toEqual([
        ['a', 'b'],
        ['b', 'a'],
      ]);
    });
  });
});
