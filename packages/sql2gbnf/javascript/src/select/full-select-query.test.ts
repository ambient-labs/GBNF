import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  fullSelectQuery,
} from './full-select-query.js';
import {
  _,
} from 'gbnf/builder';
import GBNF, {
  InputParseError,
} from 'gbnf';
import {
  include,
} from '../__fixtures__/includes.js';

describe('fullSelectQuery', () => {
  const grammar = _`${fullSelectQuery}`.toString({
    include,
    caseKind: 'any',
  });
  test.each([
    'SELECT',
    'select',
    'SELECT foo FROM table',
    'SELECT 1 FROM table',
    'SELECT (SELECT bar FROM table2) FROM table',
    'SELECT (SELECT (SELECT baz FROM table3) FROM table2) FROM table',
    'SELECT foo FROM table WHERE foo = "foo"',
    // you spent so much time wondering if you could, you never stopped to think if you should
    'SELECT (SELECT (SELECT (SELECT qux FROM table4) FROM table3) FROM table2) FROM table',
  ])('it parses input "%s"', (initial) => {
    let parser = GBNF(grammar);
    parser = parser.add(initial.split('\\n').join('\n'));
    expect(parser.size).toBeGreaterThan(0);
  });

  test.each([
    'select;',
    'select .',
    `SELECT INTO newtable column1, column2 INTO newtable FROM sourcetable;`,
    `SELECT * FROM foo WHERE name = foo.name\\n\\nAnd you.`,
    `SELECT * FROM foo WHERE name = 'bar'\\n\\nAnd you like "tar"`,
  ])('rejects %s for bad input', (_initial) => {
    let parser = GBNF(grammar);
    const initial = _initial.split('\\n').join('\n');
    expect(() => parser.add(initial)).toThrowInputParseError(initial);
  });
});


