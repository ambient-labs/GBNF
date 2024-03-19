import { describe, test, expect } from 'vitest';
import GBNF, { RuleType, } from '../src/index.js';

describe('additional strings', () => {
  test.each([
    // single char rule
    ['root ::= "foo"', 'f', '1',],
    ['root ::= "foo"', 'f', 'b',],
    ['root ::= "foo"', 'f', 'o1',],
    ['root ::= "foo"', 'f', 'ooo',],
    ['root ::= "foo"', 'f', 'ooooooo',],

    // two char rules
    ['root ::= "foo" | "bar"', 'f', '1',],
    ['root ::= "foo" | "bar"', 'b', '1',],
    ['root ::= "foo" | "bar"', 'f', 'o1',],
    ['root ::= "foo" | "bar"', 'b', 'a1',],
    ['root ::= "foo" | "bar"', 'f', 'ooo',],
    ['root ::= "foo" | "bar"', 'b', 'arrr',],

    // three char rules
    ['root ::= "foo" | "bar" | "baz"', 'f', '1',],
    ['root ::= "foo" | "bar" | "baz"', 'f', 'z',],
    ['root ::= "foo" | "bar" | "baz"', 'b', 'b1',],
    ['root ::= "foo" | "bar" | "baz"', 'f', 'o1',],
    ['root ::= "foo" | "bar" | "baz"', 'b', 'al',],
    ['root ::= "foo" | "bar" | "baz"', 'f', 'ooo',],
    ['root ::= "foo" | "bar" | "baz"', 'b', 'azrr',],

    // expressions
    ['root ::= foo\\nfoo ::="foo"', 'f', '1',],
    ['root ::= foo\\nfoo ::="foo"', 'f', 'b',],
    ['root ::= foo\\nfoo ::="foo"', 'f', 'o1',],
    ['root ::= foo\\nfoo ::="foo"', 'f', 'ooo',],

    // expression and a char rule
    ['root::=foo|"bar"\\nfoo::="foo"', 'f', '1',],
    ['root::=foo|"bar"\\nfoo::="foo"', 'f', 'z',],
    ['root::=foo|"bar"\\nfoo::="foo"', 'b', 'b1',],
    ['root::=foo|"bar"\\nfoo::="foo"', 'f', 'o1',],
    ['root::=foo|"bar"\\nfoo::="foo"', 'f', 'ooo',],
    ['root::=foo|"bar"\\nfoo::="foo"', 'b', 'arr',],

    // two expressions
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'f', '1',],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'f', 'z',],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'b', '1',],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'f', 'o1',],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'f', 'ooo',],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'b', 'arr',],

    // nested expressions
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'f', '1',],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'f', 'z',],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'b', '1',],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'f', 'o1',],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'f', 'ooo',],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'b', 'arr',],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'b', 'azr',],

    // ranges
    ['root ::= [a-z]', 'a', 'A',],
    ['root ::= [a-z]', 'a', '0',],
    ['root ::= [a-z]', 'a', 'az',],

    // range with ? modifier
    [`root ::= [a-z]?`, 'a', 'A',],
    [`root ::= [a-z]?`, 'a', '0',],
    [`root ::= [a-z]?`, 'a', 'az',],

    // range with + modifier
    [`root ::= [a-z]+`, 'a', 'A',],
    [`root ::= [a-z]+`, 'a', '0',],
    [`root ::= [a-z]+`, 'a', 'z0',],

    // range with * modifier
    [`root ::= [a-z]*`, 'a', 'A',],
    [`root ::= [a-z]*`, 'a', '0',],
    [`root ::= [a-z]*`, 'a', 'z0',],
  ])('it throws if encountering a grammar `%s` with starting `%s` and additional `%s`', (grammar, starting, additional) => {
    expect(() => {
      const graph = GBNF(grammar.split('\\n').join('\n'), starting);
      graph.add(additional);
    }).toThrow();
  });

  test.each([
    // single char rule
    ['root ::= "foo"', '', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= "foo"', 'f', 'o', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= "foo"', 'fo', 'o', [
      { type: RuleType.END },
    ]],

    // two char rules
    ['root ::= "foo" | "bar" ', '', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'f', 'o', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'fo', 'o', [
      { type: RuleType.END },
    ]],
    ['root ::= "foo" | "bar" ', '', 'b', [
      { type: RuleType.CHAR, value: ['a'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'b', 'a', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'ba', 'r', [
      { type: RuleType.END },
    ]],

    // three char rules
    ['root ::= "foo" | "bar" | "baz"', 'b', 'a', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['z'.charCodeAt(0)], },
    ]],

    // char not
    ['root ::= [^f] "o"', 'g', 'o', [
      { type: RuleType.END },
    ]],
    ['root ::= [^A-Z]', '', 'a', [
      { type: RuleType.END },
    ]],
    ['root ::= [^A-Z0-9]', '', 'a', [
      { type: RuleType.END },
    ]],
    ['root ::= [^A-Z0-9_-]', '', 'a', [
      { type: RuleType.END },
    ]],

    // expressions
    ['root ::= foo\\nfoo ::= "foo"', '', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo\\nfoo ::= "foo"', 'f', 'o', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo\\nfoo ::= "foo"', 'fo', 'o', [
      { type: RuleType.END },
    ]],

    // expression and a char rule
    ['root ::= foo | "bar"\\nfoo ::= "foo"', '', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'f', 'o', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'fo', 'o', [
      { type: RuleType.END },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', '', 'b', [
      { type: RuleType.CHAR, value: ['a'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'b', 'a', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'ba', 'r', [
      { type: RuleType.END },
    ]],

    // two expressions
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', '', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'f', 'o', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'fo', 'o', [
      { type: RuleType.END },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', '', 'b', [
      { type: RuleType.CHAR, value: ['a'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'b', 'a', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'ba', 'r', [
      { type: RuleType.END },
    ]],

    // nested expressions
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', '', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'f', 'o', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'fo', 'o', [
      { type: RuleType.END },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', '', 'b', [
      { type: RuleType.CHAR, value: ['a'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'b', 'a', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['z'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'ba', 'r', [
      { type: RuleType.END },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'ba', 'z', [
      { type: RuleType.END },
    ]],

    // ranges
    ['root ::= [a-z]', '', 'a', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-z]', '', 'm', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-z]', '', 'z', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z]', '', 'a', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z]', '', 'Z', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z0-9]', '', 'Z', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z0-9]', '', '0', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z0-9]', '', '9', [
      { type: RuleType.END },
    ]],

    // range with ? modifier
    [`root ::= [a-z]?`, '', 'a', [
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]?`, '', 'Z', [
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z0-9]?`, '', '0', [
      { type: RuleType.END, },
    ]],

    // range with + modifier
    [`root ::= [a-z]+`, '', 'a', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, '', 'Z', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, 'azA', 'Z', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],

    // range with * modifier
    [`root ::= [a-z]*`, '', 'a', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, '', 'Z', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, 'acczABC', 'Z', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    ['root ::= "foo" | "bar" | "baz" | "bazaar" | "barrington" ', 'baza', 'a', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
    ]],

    // char not with modifiers
    ['root ::= [^f]+ "o"', 'aaa', 'a', [
      { type: RuleType.CHAR_EXCLUDE, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= [^A-Z]+', 'abc', 'd', [
      {
        type: RuleType.CHAR_EXCLUDE, value: [
          [
            'A'.charCodeAt(0),
            'Z'.charCodeAt(0),
          ],
        ],
      },
      { type: RuleType.END, },
    ]],
    ['root ::= [^A-Z0-9]*', 'abc', 'd', [
      {
        type: RuleType.CHAR_EXCLUDE, value: [
          [
            'A'.charCodeAt(0),
            'Z'.charCodeAt(0),
          ],
          [
            '0'.charCodeAt(0),
            '9'.charCodeAt(0),
          ],
        ],
      },
      { type: RuleType.END, },
    ]],
    ['root ::= [^A-Z0-9_-]*', 'abc', 'd', [
      {
        type: RuleType.CHAR_EXCLUDE, value: [
          [
            'A'.charCodeAt(0),
            'Z'.charCodeAt(0),
          ],
          [
            '0'.charCodeAt(0),
            '9'.charCodeAt(0),
          ],
          '_'.charCodeAt(0),
          '-'.charCodeAt(0),
        ],
      },
      { type: RuleType.END, },
    ]],

  ])('it parses a grammar `%s` with starting `%s` and additional `%s`', (grammar, starting, additional, expected) => {
    let state = GBNF(grammar.split('\\n').join('\n'));
    state = state.add(starting);
    state = state.add(additional);
    expect([...state]).toEqual(expected);
  });
});
