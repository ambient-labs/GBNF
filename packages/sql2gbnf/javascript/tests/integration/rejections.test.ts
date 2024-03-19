import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  SQL2GBNF,
} from '../../src/sql2gbnf.js';
import GBNF, {
  InputParseError,
} from 'gbnf';

describe('Rejections, no schema', () => {
  test.each([
    ['1', 0],
    ['select;', 6],
    ['select .', 7],
    [`SELECT INTO newtable column1, column2 INTO newtable FROM sourcetable;`, 38],
    [`SELECT * FROM foo WHERE name = foo.name\\n\\nAnd you.`, 40],
    // [`INSERT INTO foooo (foo) VALUES (SELECT foo, bar FROM)`, 38],
  ])(`it rejects '%s'`, (_initial, errorPos) => {
    const grammar = SQL2GBNF();
    let parser = GBNF(grammar);
    const initial = _initial.split('\\n').join('\n');
    expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
  });

  test.each([
    `SELECT * FROM foo WHERE name = 'bar'\\n\\nAnd you like "bar"`
    // [`INSERT INTO foooo (foo) VALUES (SELECT foo, bar FROM)`, 38],
  ])(`it rejects '%s'`, (_initial) => {
    const grammar = SQL2GBNF();
    let parser = GBNF(grammar);
    const initial = _initial.split('\\n').join('\n');
    expect(() => parser.add(initial)).toThrowInputParseError(initial);
  });
});

