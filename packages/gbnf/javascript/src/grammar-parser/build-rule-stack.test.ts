import { describe, test, expect, } from "vitest";
import { InternalRuleDef, InternalRuleType, } from "../rules-builder/types";
import { buildRuleStack, } from "./build-rule-stack";
import { UnresolvedRule, RuleType } from "../grammar-graph/types.js";

describe('buildRuleStack', () => {
  test('it builds rule stack for a single path', () => {
    expect(buildRuleStack([
      { type: InternalRuleType.CHAR, value: [120], },
    ])).toEqual([[
      { type: RuleType.CHAR, value: [120], },
      { type: RuleType.END, },
    ]]);
  });

  test('it builds rule stack for two alternate paths', () => {
    expect(buildRuleStack([
      { type: InternalRuleType.CHAR, value: [120], },
      { type: InternalRuleType.ALT, },
      { type: InternalRuleType.CHAR, value: [121], },
    ])).toEqual([[
      { type: RuleType.CHAR, value: [120], },
      { type: RuleType.END, },
    ], [
      { type: RuleType.CHAR, value: [121], },
      { type: RuleType.END, },
    ]]);
  });

  test('it builds rule stack for three alternate paths', () => {
    expect(buildRuleStack([
      { type: InternalRuleType.CHAR, value: [120], },
      { type: InternalRuleType.ALT, },
      { type: InternalRuleType.CHAR, value: [121], },
      { type: InternalRuleType.ALT, },
      { type: InternalRuleType.CHAR, value: [122], },
    ])).toEqual([[
      { type: RuleType.CHAR, value: [120], },
      { type: RuleType.END, },
    ], [
      { type: RuleType.CHAR, value: [121], },
      { type: RuleType.END, },
    ], [
      { type: RuleType.CHAR, value: [122], },
      { type: RuleType.END, },
    ]]);
  });

  test('it builds rule stack for char_not', () => {
    expect(buildRuleStack([
      { type: InternalRuleType.CHAR_NOT, value: [120], },
      { type: InternalRuleType.ALT, },
      { type: InternalRuleType.CHAR_NOT, value: [121], },
      { type: InternalRuleType.ALT, },
      { type: InternalRuleType.CHAR_NOT, value: [122], },
    ])).toEqual([[
      { type: RuleType.CHAR_EXCLUDE, value: [120], },
      { type: RuleType.END, },
    ], [
      { type: RuleType.CHAR_EXCLUDE, value: [121], },
      { type: RuleType.END, },
    ], [
      { type: RuleType.CHAR_EXCLUDE, value: [122], },
      { type: RuleType.END, },
    ]]);
  });

  test('it builds rule stack for mixed char and char_not', () => {
    expect(buildRuleStack([
      { type: InternalRuleType.CHAR_NOT, value: [120], },
      { type: InternalRuleType.ALT, },
      { type: InternalRuleType.CHAR, value: [121], },
      { type: InternalRuleType.ALT, },
      { type: InternalRuleType.CHAR_NOT, value: [122], },
    ])).toEqual([[
      { type: RuleType.CHAR_EXCLUDE, value: [120], },
      { type: RuleType.END, },
    ], [
      { type: RuleType.CHAR, value: [121], },
      { type: RuleType.END, },
    ], [
      { type: RuleType.CHAR_EXCLUDE, value: [122], },
      { type: RuleType.END, },
    ]]);
  });

  test('it builds rule stack for a char_not with two characters and a range', () => {
    expect(buildRuleStack([
      { type: InternalRuleType.CHAR_NOT, value: [120], },
      { type: InternalRuleType.CHAR_ALT, value: 121, },
      { type: InternalRuleType.CHAR_ALT, value: 122, },
      { type: InternalRuleType.CHAR_RNG_UPPER, value: 130, },
    ])).toEqual([[
      { type: RuleType.CHAR_EXCLUDE, value: [120, 121, [122, 130]], },
      { type: RuleType.END, },
    ]]);
  });

  describe('ranges', () => {
    describe('no modifiers', () => {
      test.each([
        [`[a-z]`, [
          { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
          { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
          { type: InternalRuleType.END, },
        ], [[
          { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),]], },
          { type: RuleType.END, },
        ]]],
        [
          `[a-zA-Z]`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),]], },
              { type: RuleType.END, },
            ],
          ]
        ],
        [
          `[a-zA-Z0-9]`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: '0'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: '9'.charCodeAt(0), },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),], ['0'.charCodeAt(0), '9'.charCodeAt(0),]], },
              { type: RuleType.END, },
            ],
          ]
        ],
      ] as [string, InternalRuleDef[], UnresolvedRule[][]][])('it builds rule stack for a CHAR `%s`', (_grammar, input, expected) => {
        expect(buildRuleStack(input)).toEqual(expected);
      });
    });

    describe('?', () => {
      test.each([
        [
          `[a-z]?`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.ALT, },
            { type: InternalRuleType.END, },

          ],
          [[
            { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),]], },
            { type: RuleType.END, },
          ], [
            { type: RuleType.END, },

          ]],
        ],
        [
          `[a-zA-Z]?`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.ALT, },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),]], },
              { type: RuleType.END, },
            ],
            [
              { type: RuleType.END, },

            ]
          ]
        ],
        [
          `[a-zA-Z0-9]?`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: '0'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: '9'.charCodeAt(0), },
            { type: InternalRuleType.ALT, },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),], ['0'.charCodeAt(0), '9'.charCodeAt(0),]], },
              { type: RuleType.END, },
            ],
            [
              { type: RuleType.END, },

            ],
          ]
        ],
      ] as [string, InternalRuleDef[], UnresolvedRule[][]][])('it builds rule stack for a CHAR `%s`', (_grammar, input, expected) => {
        expect(buildRuleStack(input)).toEqual(expected);
      });
    });

    describe('+', () => {
      test.each([
        [
          `[a-z]+`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.RULE_REF, value: 1 },
            { type: InternalRuleType.ALT, },
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),]], },
              { type: RuleType.REF, value: 1 },
              { type: RuleType.END, },
            ],
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),]], },
              { type: RuleType.END, },
            ],
          ],
        ],
        [
          `[a-zA-Z]+`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.RULE_REF, value: 1 },
            { type: InternalRuleType.ALT, },
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),],], },
              { type: RuleType.REF, value: 1 },
              { type: RuleType.END, },
            ],
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),],], },
              { type: RuleType.END, },
            ],
          ]
        ],
        [
          `[a-zA-Z0-9]+`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: '0'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: '9'.charCodeAt(0), },
            { type: InternalRuleType.RULE_REF, value: 1 },
            { type: InternalRuleType.ALT, },
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: '0'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: '9'.charCodeAt(0), },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),], ['0'.charCodeAt(0), '9'.charCodeAt(0),]], },
              { type: RuleType.REF, value: 1 },
              { type: RuleType.END, },
            ],
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),], ['0'.charCodeAt(0), '9'.charCodeAt(0),]], },
              { type: RuleType.END, },
            ],
          ]
        ],
      ] as [string, InternalRuleDef[], UnresolvedRule[][]][])('it builds rule stack for a CHAR `%s`', (_grammar, input, expected) => {
        expect(buildRuleStack(input)).toEqual(expected);
      });
    });

    describe('*', () => {
      test.each([
        [`[a-z]*`, [
          { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
          { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
          { type: InternalRuleType.RULE_REF, value: 1, },
          { type: InternalRuleType.ALT, },
          { type: InternalRuleType.END, },
        ], [[
          { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),],], },
          { type: RuleType.REF, value: 1, },
          { type: RuleType.END, },
        ], [
          { type: RuleType.END, },
        ]]],
        [
          `[a-zA-Z]*`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.RULE_REF, value: 1, },
            { type: InternalRuleType.ALT, },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),],], },
              { type: RuleType.REF, value: 1, },
              { type: RuleType.END, },
            ],
            [
              { type: RuleType.END, },
            ],
          ]
        ],
        [
          `[a-zA-Z0-9]*`,
          [
            { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_ALT, value: '0'.charCodeAt(0), },
            { type: InternalRuleType.CHAR_RNG_UPPER, value: '9'.charCodeAt(0), },
            { type: InternalRuleType.RULE_REF, value: 1, },
            { type: InternalRuleType.ALT, },
            { type: InternalRuleType.END, },
          ],
          [
            [
              { type: RuleType.CHAR, value: [['a'.charCodeAt(0), 'z'.charCodeAt(0),], ['A'.charCodeAt(0), 'Z'.charCodeAt(0),], ['0'.charCodeAt(0), '9'.charCodeAt(0),]], },
              { type: RuleType.REF, value: 1, },
              { type: RuleType.END, },
            ],
            [
              { type: RuleType.END, },
            ],
          ]
        ],
      ] as [string, InternalRuleDef[], UnresolvedRule[][]][])('it builds rule stack for an optionally repeating CHAR `%s`', (_grammar, input, expected) => {
        expect(buildRuleStack(input)).toEqual(expected);
      });
    });

    test('char with range: `[a-zA-Z_]`', () => {
      const input: InternalRuleDef[] = [
        { type: InternalRuleType.CHAR, value: ['a'.charCodeAt(0)], },
        { type: InternalRuleType.CHAR_RNG_UPPER, value: 'z'.charCodeAt(0), },
        { type: InternalRuleType.CHAR_ALT, value: 'A'.charCodeAt(0), },
        { type: InternalRuleType.CHAR_RNG_UPPER, value: 'Z'.charCodeAt(0), },
        { type: InternalRuleType.CHAR_ALT, value: '_'.charCodeAt(0), },
        { type: InternalRuleType.END, },
      ];
      expect(buildRuleStack(input)).toEqual([
        [
          {
            type: RuleType.CHAR, value: [
              ['a'.charCodeAt(0), 'z'.charCodeAt(0),],
              ['A'.charCodeAt(0), 'Z'.charCodeAt(0),],
              '_'.charCodeAt(0),
            ],
          },
          { type: RuleType.END, },
        ],
      ]);
    });
  });

  test('it builds rule stack for situation `root  ::= (ws )+\\nws    ::= [ \\\\t\\\\n]*`', () => {
    const input: InternalRuleDef[] = [
      { type: InternalRuleType.CHAR, value: [32] },
      { type: InternalRuleType.CHAR_ALT, value: 92 },
      { type: InternalRuleType.CHAR_ALT, value: 110 },
      { type: InternalRuleType.RULE_REF, value: 4 },
      { type: InternalRuleType.ALT },
      { type: InternalRuleType.END },
    ];
    const expected = [
      [
        { type: RuleType.CHAR, value: [32, 92, 110], },
        { type: RuleType.REF, value: 4 },
        { type: RuleType.END }
      ],
      [
        { type: RuleType.END }

      ],
    ]
    expect(buildRuleStack(input)).toEqual(expected);
  });

  test('it builds rule stack for situation `root ::= [a-zA-Z]+`', () => {
    const input: InternalRuleDef[] = [
      { type: InternalRuleType.CHAR, value: [97] },
      { type: InternalRuleType.CHAR_RNG_UPPER, value: 122 },
      { type: InternalRuleType.CHAR_ALT, value: 65 },
      { type: InternalRuleType.CHAR_RNG_UPPER, value: 90 },
      { type: InternalRuleType.RULE_REF, value: 1 },
      { type: InternalRuleType.ALT },
      { type: InternalRuleType.CHAR, value: [97] },
      { type: InternalRuleType.CHAR_RNG_UPPER, value: 122 },
      { type: InternalRuleType.CHAR_ALT, value: 65 },
      { type: InternalRuleType.CHAR_RNG_UPPER, value: 90 },
      { type: InternalRuleType.END }
    ];
    const expected = [
      [
        { type: RuleType.CHAR, value: [[97, 122], [65, 90]], },
        { type: RuleType.REF, value: 1 },
        { type: RuleType.END }
      ],
      [
        { type: RuleType.CHAR, value: [[97, 122], [65, 90]], },
        { type: RuleType.END }

      ],
    ]
    expect(buildRuleStack(input)).toEqual(expected);
  });
});
