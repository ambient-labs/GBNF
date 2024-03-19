import { describe, test, expect } from 'vitest';
import GBNF, { RuleType, } from '../src/index.js';

describe("initialization", () => {
  test.each([
    // single char rule
    ['root ::= "foo"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],
    // two char rules
    ['root ::= "foo" | "g" ', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['g'.charCodeAt(0)], },
    ]],

    // three char rules
    ['root ::= "foo" | "bar" | "g" ', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['g'.charCodeAt(0)], },
    ]],

    // three char rules with equivalent chars
    ['root ::= "foo" | "bar" | "baz" ', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],

    ['root ::= [^x]', [
      { type: RuleType.CHAR_EXCLUDE, value: ['x'.charCodeAt(0)], },
    ]],

    // expressions
    ['root ::= foo\\nfoo::="foo" ', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],
    // expression and a char rule
    ['root ::= foo|"bar"\\nfoo::="foo" ', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],
    // two expressions
    ['root ::= foo|bar\\nfoo::="foo"\\nbar::="bar" ', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],
    // nested expressions
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],

    // ranges
    ['root ::= [a-zA-Z]', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
    ]],
    // range with ? modifier
    ['root ::= [a-zA-Z]?', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END },
    ]],
    // range with + modifier
    ['root ::= [a-zA-Z]+', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
    ]],
    // range with * modifier
    ['root ::= [a-zA-Z]*', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END },
    ]],
    // real world use cases
    // arithmetic
    [
      `root  ::= (expr "=" term "\\n")+\\nexpr  ::= term ([-+*/] term)*\\nterm  ::= [0-9]+`, [
        { type: RuleType.CHAR, value: [['0'.charCodeAt(0), '9'.charCodeAt(0)]], },
      ]
    ],

  ])('it returns initial set of rules for grammar `%s`', (grammar, expectation) => {
    const state = GBNF(grammar.split('\\n').join('\n'));
    expect([...state]).toEqual(expectation);
  });
});
