import { describe, test, expect } from 'vitest';
import GBNF, { GrammarParseError, InputParseError, Rule, RuleType, } from '../src/index.js';

describe('creation', () => {
  test.each([
    [``, 0, 'No rules were found'],
    [`root = "foo"`, 5, 'Expecting ::= at 5'],
    [`root ::= foo\\nfoo := "foo"`, 17, 'Expecting ::= at 17'],
    [`root ::= foo`, 9, `Undefined rule identifier "foo"`],
    [`root ::= foo\\nbar ::= "bar"`, 9, `Undefined rule identifier "foo"`],
    [`root ::= foo\\nfoo ::= baz\\nbar ::= "bar"`, 21, `Undefined rule identifier "baz"`],
    [`root ::= foo ::= bar`, 13, `Expecting newline or end at 13`],
    [`root ::= ([a-z]\\nfoo ::= "foo"`, 20, `Expecting ')' at 20`],
    // catch * errors
    // [`root ::= *`, 10, `Expecting preceding item to */+/? at 10`],

    // catch duration errors
    // throw new GrammarParseError(this.src, this.pos, `duration of ${this.#timeLimit} exceeded:`);

    // catch circular references
    // [`root ::= foo\\nfoo ::= foo`, 21, `Undefined rule identifier "baz"`],
  ])('it throws if encountering an invalid grammar `%s`', (_grammar, errorPos, errorReason) => {
    const grammar = _grammar.split('\\n').join('\n');
    expect(() => {
      GBNF(grammar);
    }).toThrowError(new GrammarParseError(grammar, errorPos, errorReason));
  });

  test.each([
    // single char rule
    ['root ::= "foo"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],

    // two char rules
    ['root ::= "foo" | "bar" ', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],

    // three char rules
    ['root ::= "foo" | "bar" | "baz"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],

    // char not
    ['root ::= [^f] "o"', [
      { type: RuleType.CHAR_EXCLUDE, value: ['f'.charCodeAt(0)], },
    ]],
    ['root ::= [^A-Z]', [
      {
        type: RuleType.CHAR_EXCLUDE, value: [
          [
            'A'.charCodeAt(0),
            'Z'.charCodeAt(0),
          ],
        ],
      },
    ]],
    ['root ::= [^A-Z0-9]', [
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
    ]],
    ['root ::= [^A-Z0-9_-]', [
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
    ]],

    // expressions
    ['root ::= foo\\nfoo ::= "foo"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],
    ['root ::= f\\nf ::= foo\\nfoo ::= "foo"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],

    // expression and a char rule
    ['root ::= foo | "bar"\\nfoo ::= "foo"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],

    // two expressions
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],

    // nested expressions
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],

    // ranges
    ['root ::= [a-z]', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
    ]],
    ['root ::= [a-zA-Z]', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
    ]],

    // range with ? modifier
    [`root ::= [a-z]?`, [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],

    // range with + modifier
    [`root ::= [a-z]+`, [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
    ]],

    // range with * modifier
    [`root ::= [a-z]*`, [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],

    // rules that aren't used are silently ignored
    [`root ::= "foo"\\nfoo ::= "foo"`, [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],
  ])('it parses a grammar `%s`', (grammar, expected) => {
    let state = GBNF(grammar.split('\\n').join('\n'));
    expect([...state]).toEqual(expected);
  });
});

