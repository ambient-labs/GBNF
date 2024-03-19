import { describe, test, expect } from 'vitest';
import GBNF, { InputParseError, RuleType, } from '../src/index.js';

describe('creation with initial string', () => {
  test.each([
    ['root ::= "foo"', '1', new InputParseError('1', 0)],
    ['root ::= "foo"', 'b', new InputParseError('b', 0)],
    ['root ::= "foo"', 'f1', new InputParseError('f1', 1)],
    ['root ::= "foo"', 'fo1', new InputParseError('fo1', 2)],
    ['root ::= "foo"', 'fooo', new InputParseError('fooo', 3)],
    ['root ::= "foo"', 'fooooooo', new InputParseError('fooooooo', 3)],

    ['root ::= "foo" | "bar"', '1', new InputParseError('1', 0)],
    ['root ::= "foo" | "bar"', 'z', new InputParseError('z', 0)],
    ['root ::= "foo" | "bar"', 'f1', new InputParseError('f1', 1)],
    ['root ::= "foo" | "bar"', 'b1', new InputParseError('b1', 1)],
    ['root ::= "foo" | "bar"', 'fo1', new InputParseError('fo1', 2)],
    ['root ::= "foo" | "bar"', 'ba1', new InputParseError('ba1', 2)],
    ['root ::= "foo" | "bar"', 'fooo', new InputParseError('fooo', 3)],
    ['root ::= "foo" | "bar"', 'barrr', new InputParseError('barrr', 3)],

    ['root ::= "foo" | "bar" | "baz"', '1', new InputParseError('1', 0)],
    ['root ::= "foo" | "bar" | "baz"', 'z', new InputParseError('z', 0)],
    ['root ::= "foo" | "bar" | "baz"', 'f1', new InputParseError('f1', 1)],
    ['root ::= "foo" | "bar" | "baz"', 'b1', new InputParseError('b1', 1)],
    ['root ::= "foo" | "bar" | "baz"', 'fo1', new InputParseError('fo1', 2)],
    ['root ::= "foo" | "bar" | "baz"', 'bal', new InputParseError('bal', 2)],
    ['root ::= "foo" | "bar" | "baz"', 'fooo', new InputParseError('fooo', 3)],
    ['root ::= "foo" | "bar" | "baz"', 'bazrr', new InputParseError('bazrr', 3)],

    ['root ::= [^a]', 'a', new InputParseError('a', 0)],
    ['root ::= [^abc]', 'b', new InputParseError('b', 0)],
    ['root ::= [^a-z]', 'z', new InputParseError('z', 0)],
    ['root ::= [^a-zA-Z]', 'X', new InputParseError('X', 0)],
    ['root ::= [^a-zA-Z0-9]', '8', new InputParseError('8', 0)],

    ['root ::= foo\\nfoo ::= "foo"', '1', new InputParseError('1', 0)],
    ['root ::= foo\\nfoo ::= "foo"', 'b', new InputParseError('b', 0)],
    ['root ::= foo\\nfoo ::= "foo"', 'f1', new InputParseError('f1', 1)],
    ['root ::= foo\\nfoo ::= "foo"', 'fo1', new InputParseError('fo1', 2)],
    ['root ::= foo\\nfoo ::= "foo"', 'fooo', new InputParseError('fooo', 3)],

    ['root::=foo|"bar"\\nfoo::="foo"', '1', new InputParseError('1', 0)],
    ['root::=foo|"bar"\\nfoo::="foo"', 'z', new InputParseError('z', 0)],
    ['root::=foo|"bar"\\nfoo::="foo"', 'f1', new InputParseError('f1', 1)],
    ['root::=foo|"bar"\\nfoo::="foo"', 'b1', new InputParseError('b1', 1)],
    ['root::=foo|"bar"\\nfoo::="foo"', 'fo1', new InputParseError('fo1', 2)],
    ['root::=foo|"bar"\\nfoo::="foo"', 'fooo', new InputParseError('fooo', 3)],
    ['root::=foo|"bar"\\nfoo::="foo"', 'barr', new InputParseError('barr', 3)],

    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', '1', new InputParseError('1', 0)],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'z', new InputParseError('z', 0)],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'f1', new InputParseError('f1', 1)],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'b1', new InputParseError('b1', 1)],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'fo1', new InputParseError('fo1', 2)],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'fooo', new InputParseError('fooo', 3)],
    ['root::= foo | bar\\n foo::="foo"\\n bar::="bar"', 'barr', new InputParseError('barr', 3)],

    ['root ::= f | b\nf ::= fo\\nb ::= ba\nfo ::= foo\\nba ::= bar | baz\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', '1', new InputParseError('1', 0)],
    ['root ::= f | b\nf ::= fo\\nb ::= ba\nfo ::= foo\\nba ::= bar | baz\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'z', new InputParseError('z', 0)],
    ['root ::= f | b\nf ::= fo\\nb ::= ba\nfo ::= foo\\nba ::= bar | baz\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'f1', new InputParseError('f1', 1)],
    ['root ::= f | b\nf ::= fo\\nb ::= ba\nfo ::= foo\\nba ::= bar | baz\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'b1', new InputParseError('b1', 1)],
    ['root ::= f | b\nf ::= fo\\nb ::= ba\nfo ::= foo\\nba ::= bar | baz\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'fo1', new InputParseError('fo1', 2)],
    ['root ::= f | b\nf ::= fo\\nb ::= ba\nfo ::= foo\\nba ::= bar | baz\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'fooo', new InputParseError('fooo', 3)],
    ['root ::= f | b\nf ::= fo\\nb ::= ba\nfo ::= foo\\nba ::= bar | baz\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'barr', new InputParseError('barr', 3)],
    ['root ::= f | b\nf ::= fo\\nb ::= ba\nfo ::= foo\\nba ::= bar | baz\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'bazr', new InputParseError('bazr', 3)],

    ['root ::= [a-z]', 'A', new InputParseError('A', 0)],
    ['root ::= [a-z]', '0', new InputParseError('0', 0)],
    ['root ::= [a-z]', 'az', new InputParseError('az', 1)],

    [`root ::= [a-z]?`, 'A', new InputParseError('A', 0)],
    [`root ::= [a-z]?`, '0', new InputParseError('0', 0)],
    [`root ::= [a-z]?`, 'az', new InputParseError('az', 1)],

    [`root ::= [a-z]+`, 'A', new InputParseError('A', 0)],
    [`root ::= [a-z]+`, '0', new InputParseError('0', 0)],
    ['root ::= [a-z]+', 'az0', new InputParseError('az0', 2)],

    [`root ::= [a-z]*`, 'A', new InputParseError('A', 0)],
    [`root ::= [a-z]*`, '0', new InputParseError('0', 0)],
    ['root ::= [a-z]*', 'az0', new InputParseError('az0', 2)],

    // sticking to llama.cpp's implementation, for a char_not rule _and_ a char rule
    // side by side, _either_ is valid.
    // that means that input explicitly forbidden by char_not can be allowed by the char
    // rule.
    // it seems weird. but it's the way it is.
    // so below, anything in b-z is allowed, because of the second rule. Anything _not_ a-z is
    // also allowed, because of the first rule. So really the only character disallowed is 'a'.
    [`root ::= ( [^abcdefgh] | [b-z])*`, 'a', new InputParseError('a', 0)],

  ])('it throws if encountering a grammar `%s` with invalid input: `%s`', (grammar, input, error) => {
    expect(() => {
      const graph = GBNF(grammar.split('\\n').join('\n'));
      graph.add(input);
    }).toThrowError(error);
  });

  test.each([
    // single char rule
    ['root ::= "foo"', '', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],
    ['root ::= "foo"', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= "foo"', 'fo', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= "foo"', 'foo', [
      { type: RuleType.END },
    ]],

    // two char rules
    ['root ::= "foo" | "bar" ', '', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'fo', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'foo', [
      { type: RuleType.END },
    ]],
    ['root ::= "foo" | "bar" ', 'b', [
      { type: RuleType.CHAR, value: ['a'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'ba', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
    ]],
    ['root ::= "foo" | "bar" ', 'bar', [
      { type: RuleType.END },
    ]],

    // three char rules
    ['root ::= "foo" | "bar" | "baz"', 'ba', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['z'.charCodeAt(0)], },
    ]],

    // chars that shadow built-in characters
    [`root ::= "["`, '[', [
      { type: RuleType.END },
    ]],
    [`root ::= "]"`, ']', [
      { type: RuleType.END },
    ]],
    [`root ::= "[]"`, '[]', [
      { type: RuleType.END },
    ]],
    [`root ::= "{"`, '{', [
      { type: RuleType.END },
    ]],
    [`root ::= "}"`, '}', [
      { type: RuleType.END },
    ]],
    [`root ::= "{}"`, '{}', [
      { type: RuleType.END },
    ]],
    [`root ::= "[{}]"`, '[{}]', [
      { type: RuleType.END },
    ]],
    [`root ::= "[{\\"}]"`, '[{"}]', [
      { type: RuleType.END },
    ]],

    // char not
    ['root ::= [^f] "o"', '', [
      { type: RuleType.CHAR_EXCLUDE, value: ['f'.charCodeAt(0)], },
    ]],
    ['root ::= [^f] "o"', 'a', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= [^A-Z]', '', [
      {
        type: RuleType.CHAR_EXCLUDE, value: [
          [
            'A'.charCodeAt(0),
            'Z'.charCodeAt(0),
          ],
        ],
      },
    ]],
    ['root ::= [^A-Z0-9]', '', [
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
    ['root ::= [^A-Z0-9_-]', '', [
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
    ['root ::= foo\\nfoo ::= "foo"', '', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],
    ['root ::= foo\\nfoo ::= "foo"', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo\\nfoo ::= "foo"', 'fo', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo\\nfoo ::= "foo"', 'foo', [
      { type: RuleType.END },
    ]],
    ['root ::= f\\nf ::= foo\\nfoo ::= "foo"', '', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
    ]],

    // expression and a char rule
    ['root ::= foo | "bar"\\nfoo ::= "foo"', '', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'fo', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'foo', [
      { type: RuleType.END },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'b', [
      { type: RuleType.CHAR, value: ['a'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'ba', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
    ]],
    ['root ::= foo | "bar"\\nfoo ::= "foo"', 'bar', [
      { type: RuleType.END },
    ]],

    // two expressions
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', '', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'fo', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'foo', [
      { type: RuleType.END },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'b', [
      { type: RuleType.CHAR, value: ['a'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'ba', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
    ]],
    ['root ::= foo | bar\\nfoo ::= "foo"\\nbar ::= "bar"', 'bar', [
      { type: RuleType.END },
    ]],

    // nested expressions
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', '', [
      { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'f', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'fo', [
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'foo', [
      { type: RuleType.END },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'b', [
      { type: RuleType.CHAR, value: ['a'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'ba', [
      { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['z'.charCodeAt(0)], },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'bar', [
      { type: RuleType.END },
    ]],
    ['root ::= f | b\\nf ::= fo\\nb ::= ba\\nfo ::= foo\\nba ::= bar | baz\\nfoo ::= "foo"\\nbar ::= "bar"\\nbaz ::= "baz"', 'baz', [
      { type: RuleType.END },
    ]],

    // ranges
    ['root ::= [a-z]', '', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
    ]],
    ['root ::= [a-zA-Z]', '', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
    ]],
    ['root ::= [a-z]', 'a', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-z]', 'm', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-z]', 'z', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z]', 'a', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z]', 'Z', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z0-9]', 'Z', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z0-9]', '0', [
      { type: RuleType.END },
    ]],
    ['root ::= [a-zA-Z0-9]', '9', [
      { type: RuleType.END },
    ]],

    // range with ? modifier
    [`root ::= [a-z]?`, '', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-z]?`, 'a', [
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]?`, 'Z', [
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z0-9]?`, '0', [
      { type: RuleType.END, },
    ]],

    // range with + modifier
    [`root ::= [a-z]+`, '', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
    ]],
    [`root ::= [a-z]+`, 'l', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, 'Z', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, 'aZ', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, 'azAZ', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],

    // range with * modifier
    [`root ::= [a-z]*`, '', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-z]*`, 'a', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, 'Z', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],
    [`root ::= [a-zA-Z]+`, 'abczABCZ', [
      { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0)], ['A'.charCodeAt(0), 'Z'.charCodeAt(0)]], },
      { type: RuleType.END, },
    ]],

    // char not with modifiers
    ['root ::= [^f]+ "o"', 'aaa', [
      { type: RuleType.CHAR_EXCLUDE, value: ['f'.charCodeAt(0)], },
      { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
    ]],
    ['root ::= [^A-Z]+', 'abc', [
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
    ['root ::= [^A-Z0-9]*', 'abc', [
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
    ['root ::= [^A-Z0-9_-]*', 'abc', [
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

    // real world bugs
    [
      'root ::= [a-z] | xyx\\nxyx ::= "foo"',
      'f', [
        { type: RuleType.END },
        { type: RuleType.CHAR, value: ['o'.charCodeAt(0)], },
      ]
    ],
    // "baz" and "bazaar" are ambiguous, and a string "bazaa" should not result in an 'a' CHAR rule
    [
      'root ::= "foo" | "bar" | "baz" | "bazaar" | "barrington" ',
      'bazaa', [
        { type: RuleType.CHAR, value: ['r'.charCodeAt(0)], },
      ]
    ],
    // should be able to step _into_ a rule, and then continue with the previous rule
    [
      'root ::= ("bar" | "foo") "zyx"',
      'bar', [
        { type: RuleType.CHAR, value: ['z'.charCodeAt(0)], },
      ]
    ],
    // should be able to process a rule, then step _into_ a rule, with a pointer to previous rule
    [
      'root ::= "z" ("bar" | "foo") "zzzz"',
      'z', [
        { type: RuleType.CHAR, value: ['b'.charCodeAt(0)], },
        { type: RuleType.CHAR, value: ['f'.charCodeAt(0)], },
      ]
    ],
    // should be able to process a rule, then step _into_ a rule, and then continue with the previous rule
    [
      'root ::= "z" ("bar" | "foo") "zzz"',
      'zbar', [
        { type: RuleType.CHAR, value: ['z'.charCodeAt(0)], },
      ]
    ],
    [
      `root  ::= termz ([-+*/] termz)* \\n termz  ::= [0-9]+`,
      '1', [
        { type: RuleType.CHAR, value: [['0'.charCodeAt(0), '9'.charCodeAt(0)]], },
        {
          type: RuleType.CHAR, value: [
            '-'.charCodeAt(0),
            '+'.charCodeAt(0),
            '*'.charCodeAt(0),
            '/'.charCodeAt(0),
          ],
        },
        { type: RuleType.END, },
      ]
    ],
    [
      `root  ::= expr "=" termy  \\nexpr  ::= termy ([-+*/] termy)*\\n termy  ::= [0-9]+`,
      '1', [
        { type: RuleType.CHAR, value: [['0'.charCodeAt(0), '9'.charCodeAt(0)]], },
        {
          type: RuleType.CHAR, value: [
            '-'.charCodeAt(0),
            '+'.charCodeAt(0),
            '*'.charCodeAt(0),
            '/'.charCodeAt(0),
          ],
        },
        {
          type: RuleType.CHAR, value: ['='.charCodeAt(0),],
        },
      ]
    ],
    [
      `root  ::= (expr "=" terma "\\n")+\\nexpr  ::= terma ([-+*/] terma)*\\nterma  ::= [0-9]+`,
      '1', [
        { type: RuleType.CHAR, value: [['0'.charCodeAt(0), '9'.charCodeAt(0)]], },
        {
          type: RuleType.CHAR, value: [
            '-'.charCodeAt(0),
            '+'.charCodeAt(0),
            '*'.charCodeAt(0),
            '/'.charCodeAt(0),
          ],
        },
        {
          type: RuleType.CHAR, value: ['='.charCodeAt(0),],
        },
      ]
    ],
    [
      `root  ::= (expr "=" termb "\\n")+\\nexpr  ::= termb ([-+*/] termb)*\\ntermb  ::= [0-9]+`,
      '1+',
      [
        { type: RuleType.CHAR, value: [['0'.charCodeAt(0), '9'.charCodeAt(0)]], },
      ],
    ],
    [
      `root  ::= (expr "=" termc "\\n")+\\nexpr  ::= termc ([-+*/] termc)*\\ntermc  ::= [0-9]+`,
      '1=', [
        { type: RuleType.CHAR, value: [['0'.charCodeAt(0), '9'.charCodeAt(0)]], },
      ],
    ],
    [
      `root  ::= (expr "=" termd "\\n")+\\nexpr  ::= termd ([-+*/] termd)*\\ntermd  ::= [0-9]+`,
      '1+1', [
        { type: RuleType.CHAR, value: [['0'.charCodeAt(0), '9'.charCodeAt(0)]], },
        { type: RuleType.CHAR, value: ['-'.charCodeAt(0), '+'.charCodeAt(0), '*'.charCodeAt(0), '/'.charCodeAt(0)], },
        { type: RuleType.CHAR, value: ['='.charCodeAt(0)], },
      ]
    ],
    [
      `root  ::= (expr "=" term "\\n")+\\nexpr  ::= term ([-+*/] term)*\\nterm  ::= [0-9]+`,
      '1=1', [
        { type: RuleType.CHAR, value: [['0'.charCodeAt(0), '9'.charCodeAt(0)]], },
        { type: RuleType.CHAR, value: ['\n'.charCodeAt(0)], },
      ],
    ],
    [
      `root ::= "\\\"" ( [^"abcdefghA-Z])* `,
      `" is not only in its lyrism, its vow to sustin it in its poo-sion, its r,v:l'y, it's tory,`,
      [
        {
          type: RuleType.CHAR_EXCLUDE, value: [
            '"'.charCodeAt(0),
            'a'.charCodeAt(0),
            'b'.charCodeAt(0),
            'c'.charCodeAt(0),
            'd'.charCodeAt(0),
            'e'.charCodeAt(0),
            'f'.charCodeAt(0),
            'g'.charCodeAt(0),
            'h'.charCodeAt(0),
            ['A'.charCodeAt(0), 'Z'.charCodeAt(0)],
          ],
        },
        { type: RuleType.END, },
      ],
    ],
    // sticking to llama.cpp's implementation, for a char_not rule _and_ a char rule
    // side by side, _either_ is valid.
    // that means that input explicitly forbidden by char_not can be allowed by the char
    // rule.
    // it seems weird. but it's the way it is.
    // so below, anything in b-z is allowed, because of the second rule. Anything _not_ a-z is
    // also allowed, because of the first rule. So really the only character disallowed is 'a'.
    [
      `root ::= ( [^abcdefgh] | [b-z])* `,
      'bcdefghzyxw0123ABCZ',
      [
        {
          type: RuleType.CHAR_EXCLUDE, value: [
            'a'.charCodeAt(0),
            'b'.charCodeAt(0),
            'c'.charCodeAt(0),
            'd'.charCodeAt(0),
            'e'.charCodeAt(0),
            'f'.charCodeAt(0),
            'g'.charCodeAt(0),
            'h'.charCodeAt(0),
          ],
        },
        {
          type: RuleType.CHAR, value: [
            ['b'.charCodeAt(0), 'z'.charCodeAt(0)],
          ],
        },
        { type: RuleType.END, },

      ],
    ],
  ])('it parses a grammar `%s` against input: `%s`', (grammar, input, expected) => {
    let state = GBNF(grammar.split('\\n').join('\n'));
    state = state.add(input);
    expect([...state]).toEqual(expected);
  });
});
