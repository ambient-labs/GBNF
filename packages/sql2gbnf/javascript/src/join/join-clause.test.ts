import {
  vi,
  describe,
  test,
  expect,
} from 'vitest';
import GBNF, { InputParseError } from "gbnf";
import { joinClause, } from "./join-clause.js";
import {
  _,
} from 'gbnf/builder';

import * as _joinCondition from './join-condition.js';
import {
  verboseInclude,
} from '../__fixtures__/includes.js';

vi.mock('./join-condition.js', async () => {
  const actual = await vi.importActual('./join-condition.js') as typeof _joinCondition;
  return {
    ...actual,
    joinCondition: `"x"`,
  };
});

describe('joinClause', () => {
  test.each([
    'join',
    'inner \\njoin',
    'left \\njoin',
    'right \\njoin',
    'full \\njoin',
    'full \\nouter join',
    'left \\ninner\\njoin',
    'left \\nouter\\njoin',
    'right \\nouter\\njoin',
    'right \\ninner\\njoin',
    'JOIN table1 ON ',
    'INNER JOIN table1 ON ',
    'INNER JOIN table1 ON \\n\\n ',
    'INNER JOIN table1  \\n\\nON ',
  ])('it parses schema to grammar with input "%s"', (initial) => {
    let parser = GBNF(joinClause.compile({
      caseKind: 'any',
      include: verboseInclude,
    }));
    parser = parser.add(initial.split('\\n').join('\n'));
    expect(parser.size).toBeGreaterThan(0);
  });

  test.each([
    ['INNER FULL JOIN table1 ON ', 6],
    ['INNER left JOIN table1 ON ', 6],
    ['INNER right JOIN table1 ON ', 6],
    ['outer right JOIN table1 ON ', 6],
    ['outer left JOIN table1 ON ', 6],
  ])('it raises on bad input %s', (_initial, errorPos) => {
    // console.log(fullGrammar);
    let parser = GBNF(joinClause.compile({
      caseKind: 'any',
      include: verboseInclude,
    }));
    const initial = _initial.split('\\n').join('\n').trim();
    expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
  });
});
