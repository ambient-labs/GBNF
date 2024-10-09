import { g } from 'gbnf';
import {
  describe,
  test,
  expect,
} from 'vitest';

import {
  $ as ssssss,
} from './string-rule.js';
import {
  CaseKind,
} from './types.js';


describe('StringGBNFRule', () => {
  describe('singleline', () => {
    test.each([
      ['root ::= "SELECT"', ssssss`SELECT`],
      ['root ::= "SELECT "', ssssss`SELECT `],
      ['root ::= "  SELECT  FOO  "', ssssss`  SELECT  FOO  `],
      ['root ::= "  SELECT  \\nFOO  "', ssssss`  SELECT  \nFOO  `],
      ['root ::= "  SELECT  \\tFOO  "', ssssss`  SELECT  \tFOO  `],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\t/g, '\t');
      expect(rule.toString()).toEqual(expectation);
    });
  });

  describe('multiline', () => {
    test.each([
      [
        [
          'root ::= [a-z] x',
          'x ::= "FOO"',
        ].join('\\n'),
        g`[a-z] ${ssssss`FOO`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= "FOO"',
        ].join('\\n'),
        g` \n[a-z] \n${ssssss`FOO`}`,
      ],
      [
        [
          'root ::= " FOO " x',
          'x ::= "YYY"',
        ].join('\\n'),
        ssssss` FOO ${ssssss`YYY`}`,
      ],

      // rules can be named
      [
        [
          'root ::= " FOO " bar',
          'bar ::= "ZZZ"',
        ].join('\\n'),
        ssssss` FOO ${ssssss.key('bar')`ZZZ`}`,
      ],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\n/g, '\n').replace(/\\t/g, '\t').split('\n').sort().join('\n');
      expect(rule.toString()).toEqual(expectation);
    });
  });

  describe('complicated', () => {
    test.each([
      [
        [
          'root ::= x',
          'x ::= "SELECT"',
        ].join('\\n'),
        g`
        ${ssssss`SELECT`}
      `,
      ],
      [
        [
          'root ::= x x-a',
          'x ::= "SELECT"',
          'x-a ::= "FROM"',
        ].join('\\n'),
        g`
         ${ssssss`SELECT`}
         ${ssssss`FROM`}
      `,
      ],
      [
        [
          'root ::= x column-name x-a x-b',
          'column-name ::= ("*" | [a-z])',
          'x ::= "SELECT "',
          'x-b ::= [a-z]',
          'x-a ::= " FROM "',
        ].join('\\n'),
        g`
      ${ssssss`SELECT `}
      ${g.key('column-name')`("*" | [a-z])`}
      ${ssssss` FROM `}
      ${g`[a-z]`}
      `,
      ],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\n/g, '\n').replace(/\\t/g, '\t').split('\n').sort().join('\n');
      expect(rule.toString()).toEqual(expectation);
    });
  });

  describe('cases', () => {
    test.each([
      ['root ::= "SELect"', 'default' as CaseKind, ssssss`SELect`],
      ['root ::= "SELECT"', 'upper' as CaseKind, ssssss`SELect`],
      ['root ::= "select"', 'lower' as CaseKind, ssssss`SELect`],
      ['root ::= [sS] [eE] [lL] [eE] [cC] [tT]', 'any' as CaseKind, ssssss`SELect`],
    ])(`'%s'`, (_expectation, caseKind, rule) => {
      const expectation = _expectation.replace(/\\t/g, '\t').split('\n').sort().join('\n');
      expect(rule.toString({ caseKind })).toEqual(expectation);
    });
  });
});

