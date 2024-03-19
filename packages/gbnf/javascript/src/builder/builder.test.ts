import {
  describe,
  test,
  expect,
} from 'vitest';

import {
  $,
  _,
} from './index.js';
import { CaseKind } from './types.js';

describe('builder', () => {
  describe('singleline', () => {
    test.each([
      ['root ::= [a-z]', _`[a-z]`],
      ['root ::= [a-z]', _` [a-z]`],
      ['root ::= [a-z]', _`[a-z] `],
      ['root ::= [a-z]', _` [a-z] `],
      ['root ::= [a-z]', _`\n[a-z]`],
      ['root ::= [a-z]', _`[a-z]\n`],
      ['root ::= [a-z]', _`\n[a-z]\n`],
      ['root ::= [a-z]', _`\t[a-z]`],
      ['root ::= [a-z]', _`[a-z]\t`],
      ['root ::= [a-z]', _`\t[a-z]\t`],
      ['root ::= [a-z] [a-z]', _` [a-z]  [a-z] `],
      ['root ::= [a-z] [a-z] [a-z]', _` [a-z]   [a-z] \n\n\t\n  [a-z] `],
      ['root ::= " foo "', _`" foo "`],
      ['root ::= [a-z] [a-z] " foo "', _` [a-z]  [a-z] " foo "`],
      ['root ::= [a-z] [a-z] "  foo  "', _` [a-z]  [a-z] "  foo  "`],
      ['root ::= [a-z] [a-z] "  \\nfoo\\n  "', _` [a-z]  [a-z] "  \nfoo\n  "`],
      ['root ::= [a-z] [a-z] "  \\n\\tfoo\\t\\n  "', _` [a-z]  [a-z] "  \n\tfoo\t\n  "`],
      ['root ::= " \\" foo"', _`" \\" foo"`],
      ['root ::= " \\" foo\\""', _`" \\" foo\\""`],
      ['root ::= " \\" \\nfoo\\""', _`" \\" \nfoo\\""`],
      ['root ::= " \\" \\n\\t  foo\\""', _`" \\" \n\t  foo\\""`],
      ['root ::= [a-z] [a-z] "  foo\\n \\" \\tBAR\\""', _` [a-z]  [a-z] "  foo\n \\" \tBAR\\""`],
      ['root ::= "SELECT" "FROM"', _`  
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
      expect(rule.compile()).toEqual(expectation);
    });
  });

  describe('multiline', () => {
    test.each([
      [
        [
          'root ::= [a-z]x',
          'x ::= [0-9]',
        ].join('\\n'),
        _`[a-z]${_`[0-9]`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= [0-9]',
        ].join('\\n'),
        _`[a-z] ${_`[0-9]`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= "FOO"',
        ].join('\\n'),
        _`[a-z] ${$`FOO`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= "FOO"',
        ].join('\\n'),
        _` \n[a-z] \n${$`FOO`}`,
      ],
      [
        [
          'root ::= [a-z] x x',
          'x ::= [A-B]',
        ].join('\\n'),
        _` [a-z] ${_`[A-B]`} ${_`[A-B]`}`,
      ],
      [
        [
          'root ::= [a-z] x',
          'x ::= [A-Z]',
        ].join('\\n'),
        _` [a-z] ${_`[A-Z]`}`,
      ],
      [
        [
          'root ::= [a-z] x x',
          'x ::= [A-Z]',
        ].join('\\n'),
        _` [a-z] ${_`[A-Z]`} ${_`[A-Z]`}`,
      ],
      // rules with extra spaces should resolve to the same rule
      [
        [
          'root ::= [a-z] x x',
          'x ::= [A-Z]',
        ].join('\\n'),
        _` [a-z] ${_` \n\t[A-Z]`} ${_`[A-Z] \n\t`}`,
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
        _` [a-z] ${_.key('uppercase')`[A-Z]`}`,
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
        _`${_`[a-z]`} ${_`[ a-z]`}`,
      ],
      [
        [
          'root ::= az az-a',
          'az ::= [a-z]',
          'az-a ::= [ a-z]',
        ].join('\\n'),
        _`${_.key('az')`[a-z]`} ${_.key('az')`[ a-z]`}`,
      ],
      [
        [
          'root ::= az az-a az-b',
          'az ::= [a-z]',
          'az-a ::= [ a-z]',
          'az-b ::= [ a-z ]',
        ].join('\\n'),
        _`${_.key('az')`[a-z]`} ${_.key('az')`[ a-z]`} ${_.key('az')`[ a-z ]`}`,
      ],

      [
        [
          'root ::= x',
          'x ::= (" ")',
        ].join('\\n'),
        _`${_`(" ")`}`,
      ],
      [
        [
          'root ::= x',
          'x ::= " "',
        ].join('\\n'),
        _`${_`" "`}`,
      ],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\n/g, '\n').replace(/\\t/g, '\t').split('\n').sort().join('\n');
      expect(rule.compile()).toEqual(expectation);
    });
  });

  describe('complicated', () => {
    test.each([
      [
        [
          'root ::= [a-z]',
        ].join('\\n'),
        _`
        [a-z]
      `,
      ],
      [
        [
          'root ::= x',
          'x ::= [a-z]',
        ].join('\\n'),
        _`
        ${_`[a-z]`}
      `,
      ],
      [
        [
          'root ::= x',
          'x ::= "SELECT"',
        ].join('\\n'),
        _`
        ${$`SELECT`}
      `,
      ],
      [
        [
          'root ::= x x-a',
          'x ::= "SELECT"',
          'x-a ::= "FROM"',
        ].join('\\n'),
        _`
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
        _`
      ${$`SELECT `}
      ${_.key('column-name')`("*" | [a-z])`}
      ${$` FROM `}
      ${_`[a-z]`}
      `,
      ],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\n/g, '\n').replace(/\\t/g, '\t').split('\n').sort().join('\n');
      expect(rule.compile()).toEqual(expectation);
    });
  });

  describe('arrays', () => {
    test.each([
      [
        [
          'root ::= x',
          'x ::= [0-9]',
        ].join('\\n'),
        _`
        ${["[0-9]"]}
      `,
      ],
      [
        [
          'root ::= x',
          'x ::= [0-9] [0-9]',
        ].join('\\n'),
        _`
        ${["[0-9]", "[0-9]"]}
      `,
      ],
      [
        [
          'root ::= x-a',
          'x-a ::= x x x',
          'x ::= "y"',
        ].join('\\n'),
        _`
         ${Array(3).fill(_`"y"`)}
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
        _`
         ${Array(2).fill(_`
         ${Array(2).fill(_`"y"`)}
          `)}
      `,
      ],
      [
        [
          'root ::= x-a',
          'x ::= fxx | bar',
          'x-a ::= x',
        ].join('\\n'),
        _`
         ${_`${["fxx", "bar"]}`.separate(' | ')}
      `,
      ],
      [
        [
          'root ::= "ll1" "foo" "ll1"',
        ].join('\\n'),
        _`
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
        _`
          "ll2"
          ${undefined}
          "ll2"
          ${_`llb`}
          "ll2"
      `,
      ],
    ])(`'%s'`, (_expectation, rule) => {
      const expectation = _expectation.replace(/\\t/g, '\t').replace(/\\n/g, '\n').split('\n').sort().join('\n');
      expect(rule.compile().split('\n').sort().join('\n')).toEqual(expectation);
    });
  });

  // describe('errors', () => {
  //   test.each([
  //     [
  //       () => _`${_.key('a')`"A"`}${_.key('b')`"A"`}`,
  //     ],
  //   ])(`expect to throw: '%s'`, (rule) => {
  //     expect(() => {
  //       return rule().compile();
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
      expect(rule.compile({ caseKind })).toEqual(expectation);
    });
  });
});
