import { describe, test, expect } from 'vitest';
import { RulesBuilder } from './rules-builder.js';
import { InternalRuleDef, InternalRuleType, } from './types.js';

interface Expectation { symbolIds: [string[]], rules: InternalRuleDef[][] }

describe('Grammar Parser Tests', () => {
  test.each(([
    [
      'single-string',
      `root ::= "foo"`,
      {
        "symbolIds": [["root", 0]],
        "rules": [
          [
            { "type": InternalRuleType.CHAR, "value": ['f'.charCodeAt(0)] },
            { "type": InternalRuleType.CHAR, "value": ['o'.charCodeAt(0)] },
            { "type": InternalRuleType.CHAR, "value": ['o'.charCodeAt(0)] },
            { "type": InternalRuleType.END }
          ]
        ]
      }

    ],
    [
      'quote character',
      `root::= "\\\""`,
      {
        "symbolIds": [["root", 0]],
        "rules": [
          [
            { "type": InternalRuleType.CHAR, "value": ['"'.charCodeAt(0)] },
            { "type": InternalRuleType.END }
          ]
        ]
      }

    ],
    [
      'two-lines-referencing-expression',
      `root ::= foo
          foo  ::= "bar"
          `,
      {
        "symbolIds": [
          ["root", 0],
          ["foo", 1]
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END }],
          [
            { "type": InternalRuleType.CHAR, "value": ['b'.charCodeAt(0)] },
            { "type": InternalRuleType.CHAR, "value": ['a'.charCodeAt(0)] },
            { "type": InternalRuleType.CHAR, "value": ['r'.charCodeAt(0)] },
            { "type": InternalRuleType.END }
          ]
        ]
      }
    ],
    [
      'expression with dash',
      `root ::= foo-bar
          foo-bar ::= "bar"
          `,
      {
        "symbolIds": [
          ["root", 0],
          ["foo-bar", 1]
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END }],
          [
            { "type": InternalRuleType.CHAR, "value": ['b'.charCodeAt(0)] },
            { "type": InternalRuleType.CHAR, "value": ['a'.charCodeAt(0)] },
            { "type": InternalRuleType.CHAR, "value": ['r'.charCodeAt(0)] },
            { "type": InternalRuleType.END }
          ]
        ]
      }
    ],
    [
      'simple-grammar',
      `
    root  ::= (expr "=" term "\n")+
          expr  ::= term ([-+*/] term)*
      term  ::= [0-9]+

          `,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
          ["expr", 2],
          ["term", 3],
          ["root_4", 4],
          ["expr_5", 5],
          ["expr_6", 6],
          ["term_7", 7]
        ],
        "rules": [


          [
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.END }],
          [
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.CHAR, "value": [61] },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.CHAR, "value": [10] },
            { "type": InternalRuleType.END }
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.RULE_REF, "value": 6 },
            { "type": InternalRuleType.END }],
          [
            { "type": InternalRuleType.RULE_REF, "value": 7 },
            { "type": InternalRuleType.END }],
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END }
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [45] },
            { "type": InternalRuleType.CHAR_ALT, "value": 43 },
            { "type": InternalRuleType.CHAR_ALT, "value": 42 },
            { "type": InternalRuleType.CHAR_ALT, "value": 47 },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 5 },
            { "type": InternalRuleType.RULE_REF, "value": 6 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.END }
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [48] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.RULE_REF, "value": 7 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.CHAR, "value": [48] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.END }
          ]
        ]
      }
    ],
    [
      'longer-grammar',
      `root  ::= (expr "=" ws term "\\n")+
      expr  ::= term ([-+*/] term)*
      term  ::= ident | num | "(" ws expr ")" ws
      ident ::= [a-z] [a-z0-9_]* ws
      num   ::= [0-9]+ ws
      ws    ::= [ \\t\\n]*`,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
          ["expr", 2],
          ["ws", 3],
          ["term", 4],
          ["root_5", 5],
          ["expr_6", 6],
          ["expr_7", 7],
          ["ident", 8],
          ["num", 9],
          ["ident_10", 10],
          ["num_11", 11],
          ["ws_12", 12],
        ],
        "rules":
          [
            [
              { value: 5, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.END },
            ],
            [
              { value: 2, type: InternalRuleType.RULE_REF },
              { value: [61], type: InternalRuleType.CHAR },
              { value: 3, type: InternalRuleType.RULE_REF },
              { value: 4, type: InternalRuleType.RULE_REF },
              { value: [10], type: InternalRuleType.CHAR },
              { type: InternalRuleType.END },
            ],
            [
              { value: 4, type: InternalRuleType.RULE_REF },
              { value: 7, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.END },
            ],
            [
              { value: 12, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.END },
            ],
            [
              { value: 8, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.ALT },
              { value: 9, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.ALT },
              { value: [40], type: InternalRuleType.CHAR },
              { value: 3, type: InternalRuleType.RULE_REF },
              { value: 2, type: InternalRuleType.RULE_REF },
              { value: [41], type: InternalRuleType.CHAR },
              { value: 3, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.END },
            ],
            [
              { value: 1, type: InternalRuleType.RULE_REF },
              { value: 5, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.ALT },
              { value: 1, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.END },
            ],
            [
              { value: [45], type: InternalRuleType.CHAR },
              { value: 43, type: InternalRuleType.CHAR_ALT },
              { value: 42, type: InternalRuleType.CHAR_ALT },
              { value: 47, type: InternalRuleType.CHAR_ALT },
              { value: 4, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.END },
            ],
            [
              { value: 6, type: InternalRuleType.RULE_REF },
              { value: 7, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.ALT },
              { type: InternalRuleType.END },
            ],
            [
              { value: [97], type: InternalRuleType.CHAR },
              { value: 122, type: InternalRuleType.CHAR_RNG_UPPER },
              { value: 10, type: InternalRuleType.RULE_REF },
              { value: 3, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.END },
            ],
            [
              { value: 11, type: InternalRuleType.RULE_REF },
              { value: 3, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.END },
            ],
            [
              { value: [97], type: InternalRuleType.CHAR },
              { value: 122, type: InternalRuleType.CHAR_RNG_UPPER },
              { value: 48, type: InternalRuleType.CHAR_ALT },
              { value: 57, type: InternalRuleType.CHAR_RNG_UPPER },
              { value: 95, type: InternalRuleType.CHAR_ALT },
              { value: 10, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.ALT },
              { type: InternalRuleType.END },
            ],
            [
              { value: [48], type: InternalRuleType.CHAR },
              { value: 57, type: InternalRuleType.CHAR_RNG_UPPER },
              { value: 11, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.ALT },
              { value: [48], type: InternalRuleType.CHAR },
              { value: 57, type: InternalRuleType.CHAR_RNG_UPPER },
              { type: InternalRuleType.END },
            ],
            [
              { value: [32], type: InternalRuleType.CHAR },
              { value: 9, type: InternalRuleType.CHAR_ALT },
              { value: 10, type: InternalRuleType.CHAR_ALT },
              { value: 12, type: InternalRuleType.RULE_REF },
              { type: InternalRuleType.ALT },
              { type: InternalRuleType.END },
            ]
          ],
      },
    ],
    [
      'character unicode grammar',
      `root  ::= [ぁ-ゟ]`,
      {
        "symbolIds": [["root", 0]],
        "rules": [[
          { "type": InternalRuleType.CHAR, "value": ['ぁ'.charCodeAt(0)] },
          { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 'ゟ'.charCodeAt(0) },
          { "type": InternalRuleType.END },
        ]]
      }
    ],
    [
      'character alts grammar',
      `root  ::= [az]`,
      {
        "symbolIds": [["root", 0]],
        "rules": [[
          { "type": InternalRuleType.CHAR, "value": ['a'.charCodeAt(0)] },
          { "type": InternalRuleType.CHAR_ALT, "value": 'z'.charCodeAt(0) },
          { "type": InternalRuleType.END },
        ]]
      }
    ],
    [
      'character range grammar',
      `root  ::= [a-zA-Z0-9]`,
      {
        "symbolIds": [["root", 0]],
        "rules": [[
          { "type": InternalRuleType.CHAR, "value": ['a'.charCodeAt(0)] },
          { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 'z'.charCodeAt(0) },
          { "type": InternalRuleType.CHAR_ALT, "value": 'A'.charCodeAt(0) },
          { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 'Z'.charCodeAt(0) },
          { "type": InternalRuleType.CHAR_ALT, "value": '0'.charCodeAt(0) },
          { "type": InternalRuleType.CHAR_RNG_UPPER, "value": '9'.charCodeAt(0) },
          { "type": InternalRuleType.END },
        ]]
      }
    ],
    [
      'character range grammar with dash at end',
      `root  ::= [a-z-]`,
      {
        "symbolIds": [["root", 0]],
        "rules": [[
          { "type": InternalRuleType.CHAR, "value": ['a'.charCodeAt(0)] },
          { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 'z'.charCodeAt(0) },
          { "type": InternalRuleType.CHAR_ALT, "value": '-'.charCodeAt(0) },
          { "type": InternalRuleType.END },
        ]]
      }
    ],
    [
      'grouping',
      `root  ::= "f" ("b" | "a")`,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1]
        ],
        "rules": [
          [
            { "type": InternalRuleType.CHAR, "value": ['f'.charCodeAt(0)] },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": ['b'.charCodeAt(0)] },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.CHAR, "value": ['a'.charCodeAt(0)] },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'optional',
      `root  ::= "f"?`,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1]
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END }],
          [
            { "type": InternalRuleType.CHAR, "value": ['f'.charCodeAt(0)] },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.END }],
        ]
      }
    ],
    [
      'repeating',
      `root  ::= "f"*`,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1]
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END }],
          [
            { "type": InternalRuleType.CHAR, "value": ['f'.charCodeAt(0)] },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.END }],
        ]
      }
    ],
    [
      'repeating-at-least-once',
      `root  ::= "f"+`,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1]
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END }],
          [
            { "type": InternalRuleType.CHAR, "value": ['f'.charCodeAt(0)] },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.CHAR, "value": ['f'.charCodeAt(0)] },
            { "type": InternalRuleType.END }],
        ]
      }
    ],
    [
      'character range with optional repeating',
      `root  ::= [a-zA-Z0-9]*`,
      {
        "symbolIds": [["root", 0], ["root_1", 1]],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, value: 1 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": ['a'.charCodeAt(0)] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 'z'.charCodeAt(0) },
            { "type": InternalRuleType.CHAR_ALT, "value": 'A'.charCodeAt(0) },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 'Z'.charCodeAt(0) },
            { "type": InternalRuleType.CHAR_ALT, "value": '0'.charCodeAt(0) },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": '9'.charCodeAt(0) },
            { "type": InternalRuleType.RULE_REF, value: 1 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'grouping-repeating',
      `root  ::= "f" ("b" | "a")*`,
      {
        "symbolIds": [
          [
            "root",
            0
          ],
          [
            "root_1",
            1
          ],
          [
            "root_2",
            2
          ]
        ],
        "rules": [
          [
            { "type": InternalRuleType.CHAR, "value": ['f'.charCodeAt(0)] },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": ['b'.charCodeAt(0)] },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.CHAR, "value": ['a'.charCodeAt(0)] },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.END },
          ]
        ]
      }
    ],
    [
      'negation',
      `root ::= [^\n]`,
      {
        "symbolIds": [
          [
            "root",
            0
          ],
        ],
        "rules": [
          [
            { "type": InternalRuleType.CHAR_NOT, "value": ['\n'.charCodeAt(0)] },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'negation of range',
      `root ::= [^0-9]`,
      {
        "symbolIds": [
          [
            "root",
            0
          ],
        ],
        "rules": [
          [
            { "type": InternalRuleType.CHAR_NOT, "value": ['0'.charCodeAt(0)] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": '9'.charCodeAt(0) },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'negation with after',
      "root ::= [^\n]+ \"\n\"",
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.CHAR, "value": ['\n'.charCodeAt(0)] },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR_NOT, "value": ['\n'.charCodeAt(0)] },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.CHAR_NOT, "value": ['\n'.charCodeAt(0)] },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'longer negation',
      `root ::= "\\\"" ( [^"abcdefgh])* `,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
          ["root_2", 2],
        ],
        "rules": [
          [
            { "type": InternalRuleType.CHAR, "value": [34] },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR_NOT, "value": [34] },
            { "type": InternalRuleType.CHAR_ALT, "value": 97 },
            { "type": InternalRuleType.CHAR_ALT, "value": 98 },
            { "type": InternalRuleType.CHAR_ALT, "value": 99 },
            { "type": InternalRuleType.CHAR_ALT, "value": 100 },
            { "type": InternalRuleType.CHAR_ALT, "value": 101 },
            { "type": InternalRuleType.CHAR_ALT, "value": 102 },
            { "type": InternalRuleType.CHAR_ALT, "value": 103 },
            { "type": InternalRuleType.CHAR_ALT, "value": 104 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.END },
          ],
        ]
      }

    ],
    [
      'longer negation with a range',
      `root ::= "\\\"" ( [^"abcdefghA-Z])* `,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
          ["root_2", 2],
        ],
        "rules": [
          [
            { "type": InternalRuleType.CHAR, "value": [34] },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR_NOT, "value": [34] },
            { "type": InternalRuleType.CHAR_ALT, "value": 97 },
            { "type": InternalRuleType.CHAR_ALT, "value": 98 },
            { "type": InternalRuleType.CHAR_ALT, "value": 99 },
            { "type": InternalRuleType.CHAR_ALT, "value": 100 },
            { "type": InternalRuleType.CHAR_ALT, "value": 101 },
            { "type": InternalRuleType.CHAR_ALT, "value": 102 },
            { "type": InternalRuleType.CHAR_ALT, "value": 103 },
            { "type": InternalRuleType.CHAR_ALT, "value": 104 },
            { "type": InternalRuleType.CHAR_ALT, "value": 65 },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 90 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.ALT },
            { "type": InternalRuleType.END },
          ],
        ]
      }

    ],
    ...[
      [
        'escaped 8-bit unicode char',
        '\\x2A',
        '\x2A'.charCodeAt(0),
      ],
      [
        'escaped 16-bit unicode char',
        '\\u006F',
        '\u006F'.charCodeAt(0),
      ],
      [
        'escaped 32-bit unicode char',
        "\\U0001F4A9",
        128169,
      ],
      [
        'escaped tab char',
        "\\t",
        '\t'.charCodeAt(0),
      ],
      [
        'escaped new line char',
        "\\n",
        '\n'.charCodeAt(0),
      ],
      [
        'escaped \r char',
        "\\r",
        '\r'.charCodeAt(0),
      ],
      [
        'escaped quote char',
        "\\\"",
        '"'.charCodeAt(0),
      ],
      [
        'escaped [ char',
        "\\[",
        '['.charCodeAt(0),
      ],
      [
        'escaped ] char',
        "\\]",
        ']'.charCodeAt(0),
      ],
      [
        'escaped \\ char',
        "\\\\",
        '\\'.charCodeAt(0),
      ],
    ].map(([key, escapedChar, actualChar,],) => ([
      key,
      `root ::= "${escapedChar}"`,
      {
        "symbolIds": [["root", 0],],
        "rules": [
          [
            { "type": InternalRuleType.CHAR, "value": [actualChar] },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ] as [string, string, { symbolIds: [string[]], rules: InternalRuleDef[][] }])),
    [
      'simple arithmetic',
      `
            root  ::= (expr "=" term "\n")+
            expr  ::= term ([-+*/] term)*
            term  ::= [0-9]+
          `,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
          ["expr", 2],
          ["term", 3],
          ["root_4", 4],
          ["expr_5", 5],
          ["expr_6", 6],
          ["term_7", 7],
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.CHAR, "value": [61] },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.CHAR, "value": [10] },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.RULE_REF, "value": 6 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 7 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [45] },
            { "type": InternalRuleType.CHAR_ALT, "value": 43 },
            { "type": InternalRuleType.CHAR_ALT, "value": 42 },
            { "type": InternalRuleType.CHAR_ALT, "value": 47 },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 5 },
            { "type": InternalRuleType.RULE_REF, "value": 6 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [48] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.RULE_REF, "value": 7 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.CHAR, "value": [48] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'ranges with chars',
      `
            root  ::= [a-z0-9_]*
          `,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [97] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 122 },
            { "type": InternalRuleType.CHAR_ALT, "value": 48 },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.CHAR_ALT, "value": 95 },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'nested ranges with chars',
      `
            root ::= [a-z] [a-z0-9_]* 
          `,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
        ],
        "rules": [
          [
            { "type": InternalRuleType.CHAR, "value": [97] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 122 },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [97] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 122 },
            { "type": InternalRuleType.CHAR_ALT, "value": 48 },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.CHAR_ALT, "value": 95 },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'expression with nested range with chars',
      `
            root ::= ident
            ident ::= [a-z] [a-z0-9_]* ws
            ws    ::= [ \\t\\n]*
          `,
      {
        "symbolIds": [
          ["root", 0],
          ["ident", 1],
          ["ident_2", 2],
          ["ws", 3],
          ["ws_4", 4],
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [97] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 122 },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [97] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 122 },
            { "type": InternalRuleType.CHAR_ALT, "value": 48 },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.CHAR_ALT, "value": 95 },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [32] },
            { "type": InternalRuleType.CHAR_ALT, "value": 9 },
            { "type": InternalRuleType.CHAR_ALT, "value": 10 },
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      'lots of escapes',
      `root ::= "\\x2A" "\\u006F" "\\U0001F4A9" "\\t" "\\n" "\\r" "\\"" "\\[" "\\]" "\\\\"`,
      {
        symbolIds: [
          ["root", 0],
        ],
        rules: [
          [
            {
              "type": "CHAR",
              "value": [42],
            },
            {
              "type": "CHAR",
              "value": [111],
            },
            {
              "type": "CHAR",
              "value": [128169],
            },
            {
              "type": "CHAR",
              "value": [9],
            },
            {
              "type": "CHAR",
              "value": [10],
            },
            {
              "type": "CHAR",
              "value": [13],
            },
            {
              "type": "CHAR",
              "value": [34],
            },
            {
              "type": "CHAR",
              "value": [91],
            },
            {
              "type": "CHAR",
              "value": [93],
            },
            {
              "type": "CHAR",
              "value": [92],
            },
            {
              "type": "END"
            }
          ],
        ]
      },
    ],
    [
      'lots of escape and alternate escapes',
      `root ::= "\\x2A" "\\u006F" "\\U0001F4A9" "\\t" "\\n" "\\r" "\\"" "\\[" "\\]" "\\\\" ("\\x2A" | "\\u006F" | "\\U0001F4A9" | "\\t" | "\\n" | "\\r" | "\\"" | "\\[" | "\\]"  | "\\\\" )`,
      {
        symbolIds: [
          ["root", 0],
          ["root_1", 1],
        ],
        rules: [
          [
            {
              "type": "CHAR",
              "value": [42],
            },
            {
              "type": "CHAR",
              "value": [111],
            },
            {
              "type": "CHAR",
              "value": [128169],
            },
            {
              "type": "CHAR",
              "value": [9],
            },
            {
              "type": "CHAR",
              "value": [10],
            },
            {
              "type": "CHAR",
              "value": [13],
            },
            {
              "type": "CHAR",
              "value": [34],
            },
            {
              "type": "CHAR",
              "value": [91],
            },
            {
              "type": "CHAR",
              "value": [93],
            },
            {
              "type": "CHAR",
              "value": [92],
            },
            {
              "type": "RULE_REF",
              "value": 1
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [42],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [111],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [128169],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [9],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [10],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [13],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [34],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [91],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [93],
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [92],
            },
            {
              "type": "END"
            }
          ]
        ]
      },
    ],
    [
      'arithmetic',
      `
            root  ::= (expr "=" ws term "\\n")+
            expr  ::= term ([-+*/] term)*
            term  ::= ident | num | "(" ws expr ")" ws
            ident ::= [a-z] [a-z0-9_]* ws
            num   ::= [0-9]+ ws
            ws    ::= [ \\t\\n]*
          `,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
          ["expr", 2],
          ["ws", 3],
          ["term", 4],
          ["root_5", 5],
          ["expr_6", 6],
          ["expr_7", 7],
          ["ident", 8],
          ["num", 9],
          ["ident_10", 10],
          ["num_11", 11],
          ["ws_12", 12],
        ],
        "rules": [
          [
            { "type": InternalRuleType.RULE_REF, "value": 5 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.CHAR, "value": [61] },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.CHAR, "value": [10] },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.RULE_REF, "value": 7 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 12 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 8 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.RULE_REF, "value": 9 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.CHAR, "value": [40] },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.RULE_REF, "value": 2 },
            { "type": InternalRuleType.CHAR, "value": [41] },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.RULE_REF, "value": 5 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.RULE_REF, "value": 1 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [45] },
            { "type": InternalRuleType.CHAR_ALT, "value": 43 },
            { "type": InternalRuleType.CHAR_ALT, "value": 42 },
            { "type": InternalRuleType.CHAR_ALT, "value": 47 },
            { "type": InternalRuleType.RULE_REF, "value": 4 },
            { "type": InternalRuleType.END },
          ],

          [
            { "type": InternalRuleType.RULE_REF, "value": 6 },
            { "type": InternalRuleType.RULE_REF, "value": 7 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [97] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 122 },
            { "type": InternalRuleType.RULE_REF, "value": 10 },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.RULE_REF, "value": 11 },
            { "type": InternalRuleType.RULE_REF, "value": 3 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [97] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 122 },
            { "type": InternalRuleType.CHAR_ALT, "value": 48 },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.CHAR_ALT, "value": 95 },
            { "type": InternalRuleType.RULE_REF, "value": 10 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [48] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.RULE_REF, "value": 11 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.CHAR, "value": [48] },
            { "type": InternalRuleType.CHAR_RNG_UPPER, "value": 57 },
            { "type": InternalRuleType.END },
          ],
          [
            { "type": InternalRuleType.CHAR, "value": [32] },
            { "type": InternalRuleType.CHAR_ALT, "value": 9 },
            { "type": InternalRuleType.CHAR_ALT, "value": 10 },
            { "type": InternalRuleType.RULE_REF, "value": 12 },
            { "type": InternalRuleType.ALT, },
            { "type": InternalRuleType.END },
          ],
        ]
      }
    ],
    [
      "json.gbnf (string)",
      `
      root ::=
  "\\\"" (
    [^"\\\\\x7F\\x00-\\x1F] |
    "\\\\" (["\\\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]) # escapes
  )* "\\\"" 
      `,
      {
        "symbolIds": [
          ["root", 0],
          ["root_1", 1],
          ["root_2", 2],
          ["root_3", 3],
        ],
        "rules": [
          [
            {
              "type": "CHAR",
              "value": [34],
            },
            {
              "type": "RULE_REF",
              "value": 3
            },
            {
              "type": "CHAR",
              "value": [34],
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR_NOT",
              "value": [34],
            },
            {
              "type": "CHAR_ALT",
              "value": 92
            },
            {
              "type": "CHAR_ALT",
              "value": 127
            },
            {
              "type": "CHAR_ALT",
              "value": 0
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 31
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [92],
            },
            {
              "type": "RULE_REF",
              "value": 2
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [34],
            },
            {
              "type": "CHAR_ALT",
              "value": 92
            },
            {
              "type": "CHAR_ALT",
              "value": 47
            },
            {
              "type": "CHAR_ALT",
              "value": 98
            },
            {
              "type": "CHAR_ALT",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 110
            },
            {
              "type": "CHAR_ALT",
              "value": 114
            },
            {
              "type": "CHAR_ALT",
              "value": 116
            },
            {
              "type": "ALT",
            },
            {
              "type": "CHAR",
              "value": [117],
            },
            {
              "type": "CHAR",
              "value": [48],
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "CHAR_ALT",
              "value": 97
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 65
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 70
            },
            {
              "type": "CHAR",
              "value": [48],
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "CHAR_ALT",
              "value": 97
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 65
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 70
            },
            {
              "type": "CHAR",
              "value": [48],
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "CHAR_ALT",
              "value": 97
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 65
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 70
            },
            {
              "type": "CHAR",
              "value": [48],
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "CHAR_ALT",
              "value": 97
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 65
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 70
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 1
            },
            {
              "type": "RULE_REF",
              "value": 3
            },
            {
              "type": "ALT",
            },
            {
              "type": "END"
            }
          ]
        ]
      }
    ],
    [
      "json.gbnf (full)",
      `
    root   ::= object
    value  ::= object | array | string | number | ("true" | "false" | "null") ws

    object ::=
      "{" ws (
                string ":" ws value
        ("," ws string ":" ws value)*
      )? "}" ws

    array  ::=
      "[" ws (
                value
        ("," ws value)*
      )? "]" ws

          string ::=
      "\\\"" (
        [^"\\\\\x7F\\x00-\\x1F] |
        "\\\\" (["\\\\/bfnrt] | "u" [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F] [0-9a-fA-F]) # escapes
      )* "\\\"" ws

    number ::= ("-"? ([0-9] | [1-9] [0-9]*)) ("." [0-9]+)? ([eE] [-+]? [0-9]+)? ws

    # Optional space: by convention, applied in this grammar after literal chars when allowed
    ws ::= ([ \\t\\n] ws)?

          `,
      {
        "symbolIds": [
          ["root", 0],
          ["object", 1],
          ["value", 2],
          ["array", 3],
          ["string", 4],
          ["number", 5],
          ["value_6", 6],
          ["ws", 7],
          ["object_8", 8],
          ["object_9", 9],
          ["object_10", 10],
          ["object_11", 11],
          ["array_12", 12],
          ["array_13", 13],
          ["array_14", 14],
          ["array_15", 15],
          ["string_16", 16],
          ["string_17", 17],
          ["string_18", 18],
          ["number_19", 19],
          ["number_20", 20],
          ["number_21", 21],
          ["number_22", 22],
          ["number_23", 23],
          ["number_24", 24],
          ["number_25", 25],
          ["number_26", 26],
          ["number_27", 27],
          ["number_28", 28],
          ["number_29", 29],
          ["ws_30", 30],
          ["ws_31", 31],
        ],
        "rules": [
          [
            {
              "type": "RULE_REF",
              "value": 1
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                123
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "RULE_REF",
              "value": 11
            },
            {
              "type": "CHAR",
              "value": [
                125
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 1
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 3
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 4
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 5
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 6
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                91
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "RULE_REF",
              "value": 15
            },
            {
              "type": "CHAR",
              "value": [
                93
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                34
              ]
            },
            {
              "type": "RULE_REF",
              "value": 18
            },
            {
              "type": "CHAR",
              "value": [
                34
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 19
            },
            {
              "type": "RULE_REF",
              "value": 25
            },
            {
              "type": "RULE_REF",
              "value": 29
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                116
              ]
            },
            {
              "type": "CHAR",
              "value": [
                114
              ]
            },
            {
              "type": "CHAR",
              "value": [
                117
              ]
            },
            {
              "type": "CHAR",
              "value": [
                101
              ]
            },
            {
              "type": "ALT"
            },
            {
              "type": "CHAR",
              "value": [
                102
              ]
            },
            {
              "type": "CHAR",
              "value": [
                97
              ]
            },
            {
              "type": "CHAR",
              "value": [
                108
              ]
            },
            {
              "type": "CHAR",
              "value": [
                115
              ]
            },
            {
              "type": "CHAR",
              "value": [
                101
              ]
            },
            {
              "type": "ALT"
            },
            {
              "type": "CHAR",
              "value": [
                110
              ]
            },
            {
              "type": "CHAR",
              "value": [
                117
              ]
            },
            {
              "type": "CHAR",
              "value": [
                108
              ]
            },
            {
              "type": "CHAR",
              "value": [
                108
              ]
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 31
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 4
            },
            {
              "type": "CHAR",
              "value": [
                58
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "RULE_REF",
              "value": 2
            },
            {
              "type": "RULE_REF",
              "value": 10
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                44
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "RULE_REF",
              "value": 4
            },
            {
              "type": "CHAR",
              "value": [
                58
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "RULE_REF",
              "value": 2
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 9
            },
            {
              "type": "RULE_REF",
              "value": 10
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 8
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 2
            },
            {
              "type": "RULE_REF",
              "value": 14
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                44
              ]
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "RULE_REF",
              "value": 2
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 13
            },
            {
              "type": "RULE_REF",
              "value": 14
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 12
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR_NOT",
              "value": [
                34
              ]
            },
            {
              "type": "CHAR_ALT",
              "value": 92
            },
            {
              "type": "CHAR_ALT",
              "value": 127
            },
            {
              "type": "CHAR_ALT",
              "value": 0
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 31
            },
            {
              "type": "ALT"
            },
            {
              "type": "CHAR",
              "value": [
                92
              ]
            },
            {
              "type": "RULE_REF",
              "value": 17
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                34
              ]
            },
            {
              "type": "CHAR_ALT",
              "value": 92
            },
            {
              "type": "CHAR_ALT",
              "value": 47
            },
            {
              "type": "CHAR_ALT",
              "value": 98
            },
            {
              "type": "CHAR_ALT",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 110
            },
            {
              "type": "CHAR_ALT",
              "value": 114
            },
            {
              "type": "CHAR_ALT",
              "value": 116
            },
            {
              "type": "ALT"
            },
            {
              "type": "CHAR",
              "value": [
                117
              ]
            },
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "CHAR_ALT",
              "value": 97
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 65
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 70
            },
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "CHAR_ALT",
              "value": 97
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 65
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 70
            },
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "CHAR_ALT",
              "value": 97
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 65
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 70
            },
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "CHAR_ALT",
              "value": 97
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 102
            },
            {
              "type": "CHAR_ALT",
              "value": 65
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 70
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 16
            },
            {
              "type": "RULE_REF",
              "value": 18
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 20
            },
            {
              "type": "RULE_REF",
              "value": 21
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                45
              ]
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "ALT"
            },
            {
              "type": "CHAR",
              "value": [
                49
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "RULE_REF",
              "value": 22
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "RULE_REF",
              "value": 22
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                46
              ]
            },
            {
              "type": "RULE_REF",
              "value": 24
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "RULE_REF",
              "value": 24
            },
            {
              "type": "ALT"
            },
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 23
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                101
              ]
            },
            {
              "type": "CHAR_ALT",
              "value": 69
            },
            {
              "type": "RULE_REF",
              "value": 27
            },
            {
              "type": "RULE_REF",
              "value": 28
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                45
              ]
            },
            {
              "type": "CHAR_ALT",
              "value": 43
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "RULE_REF",
              "value": 28
            },
            {
              "type": "ALT"
            },
            {
              "type": "CHAR",
              "value": [
                48
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 57
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 26
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                32
              ]
            },
            {
              "type": "CHAR_ALT",
              "value": 9
            },
            {
              "type": "CHAR_ALT",
              "value": 10
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 30
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ]
        ]
      }
    ],
    [
      "japanese",
      `
# A probably incorrect grammar for Japanese
root        ::= jp-char+ ([ \\t\\n] jp-char+)*
jp-char     ::= hiragana | katakana | punctuation | cjk
hiragana    ::= [ぁ-ゟ]
katakana    ::= [ァ-ヿ]
punctuation ::= [、-〾]
cjk         ::= [一-鿿]

          `,
      {
        "symbolIds": [
          ["root", 0],
          ["jp-char", 1],
          ["root_2", 2],
          ["root_3", 3],
          ["root_4", 4],
          ["root_5", 5],
          ["hiragana", 6],
          ["katakana", 7],
          ["punctuation", 8],
          ["cjk", 9],
        ],
        "rules": [
          [
            {
              "type": "RULE_REF",
              "value": 2
            },
            {
              "type": "RULE_REF",
              "value": 5
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 6
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 7
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 8
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 9
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 1
            },
            {
              "type": "RULE_REF",
              "value": 2
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 1
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                32
              ]
            },
            {
              "type": "CHAR_ALT",
              "value": 9
            },
            {
              "type": "CHAR_ALT",
              "value": 10
            },
            {
              "type": "RULE_REF",
              "value": 4
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 1
            },
            {
              "type": "RULE_REF",
              "value": 4
            },
            {
              "type": "ALT"
            },
            {
              "type": "RULE_REF",
              "value": 1
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "RULE_REF",
              "value": 3
            },
            {
              "type": "RULE_REF",
              "value": 5
            },
            {
              "type": "ALT"
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                12353
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 12447
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                12449
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 12543
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                12289
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 12350
            },
            {
              "type": "END"
            }
          ],
          [
            {
              "type": "CHAR",
              "value": [
                19968
              ]
            },
            {
              "type": "CHAR_RNG_UPPER",
              "value": 40959
            },
            {
              "type": "END"
            }
          ]
        ]
      }
    ],
  ] as [string, string, Expectation,][]).map(([key, grammar, rules]) => {
    return [key, grammar.split('\n').map(l => l.trim()).join('\\n'), rules];
  }))('parses grammar %s `%s`', (_key, grammar, { symbolIds, rules }) => {
    const parsedGrammar = new RulesBuilder(grammar.split('\\n').join('\n'));
    expect(parsedGrammar.rules).toEqual(rules);
    expect(Array.from([...parsedGrammar.symbolIds])).toEqual(symbolIds);
  });
});

