import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  whereClauseInner,
} from './where-clause-inner.js';
import {
  _,
} from 'gbnf/builder';
import GBNF, {
  InputParseError,
} from 'gbnf';
import {
  include,
} from '../__fixtures__/includes.js';

describe('whereClauseInner', () => {
  const grammar = whereClauseInner.toString({
    include,
    caseKind: 'any',
  });
  test.each([
    'foo = "foo"',
  ])('it parses input "%s"', (initial) => {
    let parser = GBNF(grammar);
    parser = parser.add(initial.split('\\n').join('\n'));
    expect(parser.size).toBeGreaterThan(0);
  });

  test.each([
    [`name = foo.name\\n\\nAnd you.`, 15],
    [`name = 'bar'\\n\\nAnd you like "bar"`, 12],
  ])(`rejects bad input '%s'`, (_initial, errorPos) => {
    let parser = GBNF(grammar);
    const initial = _initial.split('\\n').join('\n');
    expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
  });
});




