import {
  describe,
  test,
  expect,
} from 'vitest';
import GBNF, { InputParseError } from "gbnf";
import {
  // getEquijoinCondition, 
  joinCondition,
} from './join-condition.js';
import { g } from 'gbnf/builder';
import {
  include,
} from '../__fixtures__/includes.js';

describe('joinCondition', () => {
  const ws = g`[ \\n\\r]`;
  const rule = joinCondition;
  test.each([
    'foo.school_name = p.school_name',
    'table1.col1 = table2.col2',
    'table1.col1 = table2.col2',
    'table1.col1 = table2.col2',
    '(table1.col1 = table2.col2)',
    '( table1.col1 = table2.col2 )',
    'table1.col1 = table2.col2 AND table1.col1 = table2.col2',
    'table1.col1 = table2.col2 OR table1.col1 = table2.col2',
  ])('it parses schema to grammar with input "%s"', (initial) => {
    const fullGrammar = rule.toString({
      include,
    });
    // console.log(fullGrammar);
    let parser = GBNF(fullGrammar);
    parser = parser.add(initial.split('\\n').join('\n').split('\\t').join('\t'));
    expect(parser.size).toBeGreaterThan(0);
  });

  test.each([
    ['(table1.col1 = table2.col2;', 26],
    ['table1.col1 = table2.col2);', 25],
    [`foo = foo and bar = bar or baz = bz`, 10],
  ])('it raises on bad input %s', (_initial, errorPos) => {
    const fullGrammar = rule.toString({
      include,
    });
    // console.log(fullGrammar);
    let parser = GBNF(fullGrammar);
    const initial = _initial.split('\\n').join('\n');
    expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
  });

});


