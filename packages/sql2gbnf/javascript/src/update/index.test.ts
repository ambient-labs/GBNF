import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  updateRule,
} from './index.js';
import {
  _,
} from 'gbnf/builder';
import GBNF from 'gbnf';
import { FULL_SELECT_QUERY } from '../keys.js';
import {
  verboseInclude,
} from '../__fixtures__/includes.js';

describe('update', () => {
  test.each([
    'UPDATE',
    'update',
    'UPDATE foo',
    'update foo',
    'UPDATE foo SET bar = 1',
    'UPDATE foo SET bar = 1 * 2, baz = 1 - 10',
    'UPDATE foo set bar = "foo"',
    'UPDATE foo set bar = \'foo\'',
    'UPDATE foo SET bar = 1, baz = "2"',
    'UPDATE foo SET bar = 1, baz = "2", qux = true, qux2 = null, qux3 = 1.2, qux4 = false, qux5 = 1.2e3',
    'UPDATE  foo \\nSET  bar  =  1 \\n , \\nbaz \\n= \\n"2";',
    'UPDATE foo SET bar=1,baz="2";',
    'UPDATE foo SET bar = 1 WHERE id = 101',
    'UPDATE foo SET bar = 1 WHERE bar=1 AND foo \\n= "bar"',
    'UPDATE foo SET s.bar = m.name',
    'UPDATE foo s SET s.bar = m.name',
    'UPDATE foo s JOIN majors m ON s.major_id = m.id SET s.bar = m.name',
    'UPDATE foo s SET s.bar = \\n( \\nFULL_SELECT_RULE \\n)',
  ])('it parses schema to grammar with input "%s"', (initial) => {
    let parser = GBNF([
      _`${updateRule} ";"`.compile({
        caseKind: 'any',
        include: verboseInclude,
      }),
      `${FULL_SELECT_QUERY} ::= "FULL_SELECT_RULE"`,
    ].join('\n'));
    parser = parser.add(initial.split('\\n').join('\n'));
    expect(parser.size).toBeGreaterThan(0);
  });
});


