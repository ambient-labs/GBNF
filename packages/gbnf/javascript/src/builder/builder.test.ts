import {
  describe,
  test,
  expect,
} from 'vitest';

import {
  g,
} from './index.js';
import {
  CaseKind,
} from './types.js';


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

  describe('chaining', () => {
    const content = 'foo';
    const key = 'foo-key';
    const wrap = '*';
    const availableMethods = ['tag', 'key', 'wrap'];
    function* generatePermutations(methods: string[], current: string[] = [], minLength: number = 2): string[][] {
      if (current.length >= minLength) {
        if (current.includes("tag") && current.some((method) => method !== "tag")) {
          yield current;
        }
      }

      if (current.length < methods.length) {
        for (const method of methods) {
          if (!current.includes(method)) {
            yield* generatePermutations(methods, [...current, method], minLength);
          }
        }
      }
    }

    const getRule = (permutation: string[]) => {
      let rule: any;

      for (const method of permutation) {
        if (method === 'tag') {
          const value = `"${content}"`;
          rule = rule === undefined ? g`${value}` : rule`${value}`;
        } else if (method === 'key' || method === 'wrap') {
          const value = method === 'key' ? key : wrap;
          rule = rule === undefined ? g[method](value) : rule[method](value);
        } else {
          throw new Error(`unknown method: ${method}`);
        }
      }

      return rule;
    }

    const getExpectation = (permutation: string[]) => {
      const _key = permutation.includes('key') ? key : 'x';
      const _wrap = permutation.includes('wrap') ? wrap : '';
      return [
        `root ::= ${_key}`,
        `${_key} ::= ${_wrap ? `("foo")${_wrap}` : `"foo"`}`,
      ].join('\n');
    };

    const permutations = [...generatePermutations(availableMethods)].map(p => p.join(','));

    test.each(permutations)('%s', (_permutation) => {
      const permutation = _permutation.split(',');
      const rule = getRule(permutation);

      const expectation = getExpectation(permutation);

      expect(g`${rule}`.toString().split('\n').sort().join('\n')).toEqual(expectation.split('\n').sort().join('\n'));
    });
  })
});
