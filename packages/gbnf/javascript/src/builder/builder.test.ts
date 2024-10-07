import {
  describe,
  test,
  expect,
} from 'vitest';

import {
  $,
  g,
} from './index.js';
import { CaseKind } from './types.js';

describe('builder', () => {
  describe('singleline', () => {
    test.each([
      ['root ::= [a-z]', g`[a-z]`],
      ['root ::= [a-z]', g` [a-z]`],
      ['root ::= [a-z]', g`[a-z] `],
      ['root ::= [a-z]', g` [a-z] `],
      ['root ::= [a-z]', g`\n[a-z]`],
      ['root ::= [a-z]', g`[a-z]\n`],
      ['root ::= [a-z]', g`\n[a-z]\n`],
      ['root ::= [a-z]', g`\t[a-z]`],
      ['root ::= [a-z]', g`[a-z]\t`],
      ['root ::= [a-z]', g`\t[a-z]\t`],
      ['root ::= [a-z] [a-z]', g` [a-z]  [a-z] `],
      ['root ::= [a-z] [a-z] [a-z]', g` [a-z]   [a-z] \n\n\t\n  [a-z] `],
      ['root ::= " foo "', g`" foo "`],
      ['root ::= [a-z] [a-z] " foo "', g` [a-z]  [a-z] " foo "`],
      ['root ::= [a-z] [a-z] "  foo  "', g` [a-z]  [a-z] "  foo  "`],
      ['root ::= [a-z] [a-z] "  \\nfoo\\n  "', g` [a-z]  [a-z] "  \nfoo\n  "`],
      ['root ::= [a-z] [a-z] "  \\n\\tfoo\\t\\n  "', g` [a-z]  [a-z] "  \n\tfoo\t\n  "`],
      ['root ::= " \\" foo"', g`" \\" foo"`],
      ['root ::= " \\" foo\\""', g`" \\" foo\\""`],
      ['root ::= " \\" \\nfoo\\""', g`" \\" \nfoo\\""`],
      ['root ::= " \\" \\n\\t  foo\\""', g`" \\" \n\t  foo\\""`],
      ['root ::= [a-z] [a-z] "  foo\\n \\" \\tBAR\\""', g` [a-z]  [a-z] "  foo\n \\" \tBAR\\""`],
      ['root ::= "SELECT" "FROM"', g`  
        "SELECT"
        "FROM"
      `],
      ['root ::= "SELECT"', $`SELECT`],
      ['root ::= "SELECT "', $`SELECT `],
      ['root ::= "  SELECT  FOO  "', $`  SELECT  FOO  `],
      ['root ::= "  SELECT  \\nFOO  "', $`  SELECT  \nFOO  `],
      ['root ::= "  SELECT  \\tFOO  "', $`  SELECT  \tFOO  `],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\t/g, '\t');
      expect(rule.toString()).toEqual(expectation);
    });
  });

  describe('multiline', () => {
    test.each([
      [
        [
          'root ::= [a-z]x',
          'x ::= [0-9]',
        ].join('\\n'),
        g`[a-z]${g`[0-9]`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= [0-9]',
        ].join('\\n'),
        g`[a-z] ${g`[0-9]`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= "FOO"',
        ].join('\\n'),
        g`[a-z] ${$`FOO`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= "FOO"',
        ].join('\\n'),
        g` \n[a-z] \n${$`FOO`}`,
      ],
      [
        [
          'root ::= [a-z] x x',
          'x ::= [A-B]',
        ].join('\\n'),
        g` [a-z] ${g`[A-B]`} ${g`[A-B]`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= [A-Z]',
        ].join('\\n'),
        g` [a-z] ${g`[A-Z]`}`,
      ],
      [
        [
          'root ::= [a-z] x x',
          'x ::= [A-Z]',
        ].join('\\n'),
        g` [a-z] ${g`[A-Z]`} ${g`[A-Z]`}`,
      ],
      // rules with extra spaces should resolve to the same rule
      [
        [
          'root ::= [a-z] x x',
          'x ::= [A-Z]',
        ].join('\\n'),
        g` [a-z] ${g` \n\t[A-Z]`} ${g`[A-Z] \n\t`}`,
      ],
      [
        [
          'root ::= " FOO " x',
          'x ::= "YYY"',
        ].join('\\n'),
        $` FOO ${$`YYY`}`,
      ],

      // rules can be named
      [
        [
          'root ::= [a-z] uppercase',
          'uppercase ::= [A-Z]',
        ].join('\\n'),
        g` [a-z] ${g.key('uppercase')`[A-Z]`}`,
      ],
      [
        [
          'root ::= " FOO " bar',
          'bar ::= "ZZZ"',
        ].join('\\n'),
        $` FOO ${$.key('bar')`ZZZ`}`,
      ],
      [
        [
          'root ::= x x-a',
          'x ::= [a-z]',
          'x-a ::= [ a-z]',
        ].join('\\n'),
        g`${g`[a-z]`} ${g`[ a-z]`}`,
      ],
      [
        [
          'root ::= az az-a',
          'az ::= [a-z]',
          'az-a ::= [ a-z]',
        ].join('\\n'),
        g`${g.key('az')`[a-z]`} ${g.key('az')`[ a-z]`}`,
      ],
      [
        [
          'root ::= az az-a az-b',
          'az ::= [a-z]',
          'az-a ::= [ a-z]',
          'az-b ::= [ a-z ]',
        ].join('\\n'),
        g`${g.key('az')`[a-z]`} ${g.key('az')`[ a-z]`} ${g.key('az')`[ a-z ]`}`,
      ],

      [
        [
          'root ::= x',
          'x ::= (" ")',
        ].join('\\n'),
        g`${g`(" ")`}`,
      ],
      [
        [
          'root ::= x',
          'x ::= " "',
        ].join('\\n'),
        g`${g`" "`}`,
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
          'root ::= [a-z]',
        ].join('\\n'),
        g`
        [a-z]
      `,
      ],
      [
        [
          'root ::= x',
          'x ::= [a-z]',
        ].join('\\n'),
        g`
        ${g`[a-z]`}
      `,
      ],
      [
        [
          'root ::= x',
          'x ::= "SELECT"',
        ].join('\\n'),
        g`
        ${$`SELECT`}
      `,
      ],
      [
        [
          'root ::= x x-a',
          'x ::= "SELECT"',
          'x-a ::= "FROM"',
        ].join('\\n'),
        g`
         ${$`SELECT`}
         ${$`FROM`}
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
      ${$`SELECT `}
      ${g.key('column-name')`("*" | [a-z])`}
      ${$` FROM `}
      ${g`[a-z]`}
      `,
      ],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\n/g, '\n').replace(/\\t/g, '\t').split('\n').sort().join('\n');
      expect(rule.toString()).toEqual(expectation);
    });
  });

  describe('arrays', () => {
    test.each([
      [
        [
          'root ::= x',
          'x ::= [0-9]',
        ].join('\\n'),
        g`
        ${["[0-9]"]}
      `,
      ],
      [
        [
          'root ::= x',
          'x ::= [0-9] [0-9]',
        ].join('\\n'),
        g`
        ${["[0-9]", "[0-9]"]}
      `,
      ],
      [
        [
          'root ::= x-a',
          'x-a ::= x x x',
          'x ::= "y"',
        ].join('\\n'),
        g`
         ${Array(3).fill(g`"y"`)}
      `,
      ],
      [
        [
          'root ::= x-c',
          'x-c ::= x-b x-b',
          'x-b ::= x-a',
          'x-a ::= x x',
          'x ::= "y"',
        ].join('\\n'),
        g`
         ${Array(2).fill(g`
         ${Array(2).fill(g`"y"`)}
          `)}
      `,
      ],
      [
        [
          'root ::= x-a',
          'x ::= fxx | bar',
          'x-a ::= x',
        ].join('\\n'),
        g`
         ${g`${["fxx", "bar"]}`.join(' | ')}
      `,
      ],
      [
        [
          'root ::= "ll1" "foo" "ll1"',
        ].join('\\n'),
        g`
          "ll1"
          "${"foo"}"
          "ll1"
      `,
      ],

      // undefined rules should maintain their indices
      [
        [
          'root ::= "ll2"  "ll2" x "ll2"',
          'x ::= llb',
        ].join('\\n'),
        g`
          "ll2"
          ${undefined}
          "ll2"
          ${g`llb`}
          "ll2"
      `,
      ],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\t/g, '\t').replace(/\\n/g, '\n').split('\n').sort().join('\n');
      expect(rule.toString().split('\n').sort().join('\n')).toEqual(expectation);
    });
  });

  // describe('errors', () => {
  //   test.each([
  //     [
  //       () => g`${g.key('a')`"A"`}${g.key('b')`"A"`}`,
  //     ],
  //   ])(`expect to throw: '%s'`, (rule) => {
  //     expect(() => {
  //       return rule().toString();
  //     }).toThrow();
  //   });
  // });

  describe('cases', () => {
    test.each([
      ['root ::= "SELect"', 'default' as CaseKind, $`SELect`],
      ['root ::= "SELECT"', 'upper' as CaseKind, $`SELect`],
      ['root ::= "select"', 'lower' as CaseKind, $`SELect`],
      ['root ::= [sS] [eE] [lL] [eE] [cC] [tT]', 'any' as CaseKind, $`SELect`],
    ])(`'%s'`, (_expectation, caseKind, rule) => {
      const expectation = _expectation.replace(/\\t/g, '\t').split('\n').sort().join('\n');
      expect(rule.toString({ caseKind })).toEqual(expectation);
    });
  });
});
