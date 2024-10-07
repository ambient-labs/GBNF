import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  $,
  _
} from './template-tags.js';

describe('GBNFRule', () => {
  describe('logging', () => {
    test('it logs', () => {
      const rule = $`foo`;
      expect(rule.log()).toEqual('foo')
    });

    test('it logs a _ string', () => {
      const rule = _`"foo"`;
      expect(rule.log()).toEqual('foo')
    });

    test('it logs two paths', () => {
      const rule = _`${$`foo`} | ${$`bar`}`;
      expect(rule.log({ shuffle: false })).toEqual(['foo', 'bar'].join('\n'))
    });

    test('it logs overlapping paths', () => {
      const rule = _`${$`foo`} | ${$`f`}`;
      expect(rule.log()).toEqual('f\nfoo')
    });

    test('turns ranges into x', () => {
      const rule = _`[a-z]`;
      expect(rule.log()).toEqual('x')
    });

    test('turns multiple ranges into x', () => {
      const rule = _`[a-z][a-z][a-z]`;
      expect(rule.log()).toEqual('xxx')
    });

    test('it handles a range and a string', () => {
      const rule = _`[a-e] | "foo"`;
      expect(rule.log({ shuffle: false })).toEqual(['x', 'foo'].join('\n'))
    });

    test('it handles an optional', () => {
      const rule = _`"z" ([a-e]? | "foo")`;
      expect(rule.log({ shuffle: false })).toEqual(['z', 'zx', 'zfoo'].join('\n'))
    });

    test('it handles an optional on a rule', () => {
      const rule = _`"z" (("bar")? | "foo")`;
      expect(rule.log({ shuffle: false })).toEqual(['z', 'zbar', 'zfoo'].join('\n'))
    });

    test('it handles a star', () => {
      const rule = _`"z" ("y")*`;
      expect(rule.log({ shuffle: false })).toEqual(['z', 'zy', 'zyy', 'zyyy'].join('\n'))
    });

    test('it handles a star wrapping a rule', () => {
      const rule = _`"z" ([a-e] | "foo")*`;
      expect(rule.log({ shuffle: false })).toEqual([
        'z',
        'zx',
        'zxx',
        'zxxx',
        'zxxfoo',
        'zxfoo',
        'zxfoox',
        'zxfoofoo',
        'zfoo',
        'zfoox',
        'zfooxx',
        'zfooxfoo',
        'zfoofoo',
        'zfoofoox',
        'zfoofoofoo',
      ].join('\n'))
    });

    test('it handles a plus', () => {
      const rule = _`"z" ("y")+`;
      expect(rule.log()).toEqual([
        'zy',
        'zyy',
        'zyyy',
      ].join('\n'))
    });

    test('it handles a negative', () => {
      const rule = _`"z" [^a-zA-Z]`;
      expect(rule.log()).toEqual([
        'z^',
      ].join('\n'))
    });

    test('it handles alt rules', () => {
      const rule = _`
        ${_`"foo" | "bar" | "baz"`}
      `;
      expect(rule.log({ shuffle: false })).toEqual([
        'foo',
        'bar',
        'baz',
      ].join('\n'))
    });

    test('it limits to n possible rules', () => {
      const rule = _`
        ${_`
          ${_`
            "foo1"
            | "foo2"
          `} 
          | "bar" 
          | "baz"`
        }
        "z"
        ${_`
          ${_`
            "foo1"
            | "foo2"
          `} 
          | "bar" 
          | "baz"`
        }
      `;
      const allPossibibilities = [
        'foo1zfoo1',
        'foo1zfoo2',
        'foo1zbar',
        'foo1zbaz',
        'foo2zfoo1',
        'foo2zfoo2',
        'foo2zbar',
        'foo2zbaz',
        'barzfoo1',
        'barzfoo2',
        'barzbar',
        'barzbaz',
        'bazzfoo1',
        'bazzfoo2',
        'bazzbar',
        'bazzbaz',
      ];
      const n = 5;
      const logs = rule.log({ n }).split('\n');
      expect(logs.length).toBe(n);
      logs.forEach(log => {
        expect(allPossibibilities).toContain(log);
      });
    });

    test('it handles max depth', () => {
      const value = _`[a-z]`.name('value');
      const repeating = _`
          ","
          value
          repeating
          `.name('repeating');
      const rule = _`
        value
        repeating
      `;
      const n = 2;
      const maxDepth = 10;
      const logs = rule.log({
        include: [value, repeating],
        n,
        maxDepth,
      }).split('\n');
      expect(logs.length).toBeLessThanOrEqual(n);

      const allPossibibilities = [
        Array(maxDepth / 2).fill('x,').join(''),
      ];
      logs.forEach(log => {
        expect(allPossibibilities).toContain(log);
      });
    });

    test('it handles infinite rules', () => {
      const value = _`[a-z]`.name('value');
      const repeating = _`
          ","
          value
          ${_`"!"`.wrap('?')}
          repeating
          `.name('repeating');
      const rule = _`
        value
        repeating
      `;
      const n = 3;
      const logs = rule.log({
        include: [value, repeating],
        n,
        maxDepth: Infinity,
        maxRunTime: 10,
      }).split('\n');
      expect(logs.length).toBe(n);
    });

  });
});
