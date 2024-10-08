import {
  vi,
  describe,
  test,
  expect,
  afterEach,
} from 'vitest';
import {
  getFixedOrderPermutations,
  getPermutation
} from './get-fixed-order-permutations.js';
import { g } from 'gbnf';


describe('getPermutation', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test('it should get permutations for a single item array', () => {
    const result = getPermutation([{ rule: g`"foo"`, key: 'foo', }]);
    expect(result.toString()).toEqual(g`"foo"`.toString());
  });

  test('it should get permutations for a two item array', () => {
    const result = getPermutation([
      { rule: g`"foo"`, key: 'foo', },
      { rule: g`"bar"`, key: 'bar', },
    ]);
    expect(result.toString()).toEqual(g`${g`${g`"foo"`} ${g`("," ${g`"bar"`})?`}`}`.toString());
  });

  test('it should get permutations for a three item array', () => {
    const result = getPermutation([
      { rule: g`"foo"`, key: 'foo', },
      { rule: g`"bar"`, key: 'bar', },
      { rule: g`"baz"`, key: 'baz', },
    ]);
    expect(result.toString()).toEqual(g`${g`${g`"foo"`} ${g`("," ${g`"bar"`})?`} ${g`("," ${g`"baz"`})?`}`}`.toString());
  });
});


describe('getFixedOrderPermutations', () => {
  test('it should get permutations for a single item array', () => {
    const result = getFixedOrderPermutations([{ rule: g`"foo"`, key: 'foo', }]);
    expect(result.toString()).toEqual(g`"foo"`.toString());
  });

  test('it should get permutations for a two item array', () => {
    const result = getFixedOrderPermutations([
      { rule: g`"foo"`, key: 'foo', },
      { rule: g`"bar"`, key: 'bar', },
    ]);
    expect(result.map(i => i.toString())).toEqual([
      g`${g`${g`"foo"`} ${g`("," ${g`"bar"`})?`}`}`.toString(),
      g`"bar"`.toString(),
    ]);
  });
});

