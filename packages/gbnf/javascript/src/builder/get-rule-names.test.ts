import {
  describe,
  expect,
  test,
  vi,
} from 'vitest';
import {
  getRuleNames,
} from './get-rule-names.js';
import { GrammarBuilder } from './grammar-builder.js';
import {
  _,
} from '../builder/template-tags.js';

const parser = new GrammarBuilder();

describe('getRuleNames', () => {
  test('it gets rule names for strings', () => {
    expect(getRuleNames(
      ['a', 'b'],
      parser,
      'default',
    )).toEqual(['a', 'b']);
  });

  test('it gets rule names for rules', () => {
    expect(getRuleNames(
      [_`a`.name('a1'), _`b`.name('b1')],
      parser,
      'default',
    )).toEqual(['a1', 'b1']);
  });

  test('it returns a mixed group', () => {
    expect(getRuleNames(
      ['foo', _`a`.name('a1'), undefined, _`b`.name('b1')],
      parser,
      'default',
    )).toEqual(['foo', 'a1', undefined, 'b1']);
  });

  describe('arrays', () => {
    test.each([
      [
        [
          'foo',
          _`a`.name('a1'),
          undefined,
          [
            _`c`.name('c1'),
            _`d`.name('d1'),
          ],
          _`b`.name('b1'),
        ],
        ['foo', 'a1', undefined, 'x', 'b1'],
        [
          'a1 ::= a',
          'b1 ::= b',
          'c1 ::= c',
          'd1 ::= d',
          'x ::= c1 d1',
        ],
      ],

    ])(`(array) it handles '%s'`, (rules, expectation, grammar) => {
      const ruleNames = getRuleNames(
        rules,
        parser,
        'default',
      );
      expect(ruleNames.sort()).toEqual(expectation.sort());
      expect([...parser.grammar].sort()).toEqual(grammar.sort());
    });
  });
});
