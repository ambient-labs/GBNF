import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  whereClause,
} from './where-clause.js';
import {
  g,
} from 'gbnf/builder';
import GBNF, {
  InputParseError,
} from 'gbnf';
import {
  include,
} from '../__fixtures__/includes.js';

describe('whereClause', () => {
  const grammar = whereClause.toString({
    include,
    caseKind: 'any',
  });
  test.each([
    ' WHERE foo = "foo"',
  ])('it parses input "%s"', (initial) => {
    let parser = GBNF(grammar);
    parser = parser.add(initial.split('\\n').join('\n'));
    expect(parser.size).toBeGreaterThan(0);
  });

  test.each([
    ` WHERE name = foo.name\\n\\nAnd you.`,
    ` WHERE name = 'bar'\\n\\nAnd you like "bar"`,
  ])(`rejects bad input '%s'`, (_initial) => {
    let parser = GBNF(grammar);
    const initial = _initial.split('\\n').join('\n');
    expect(() => parser.add(initial)).toThrowInputParseError(initial);
  });
});



