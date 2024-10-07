import {
  describe,
  test,
  expect,
} from 'vitest';
import GBNF from "gbnf";
import { windowStatement } from './window-statement.js';
import { _ } from 'gbnf/builder';
import {
  include,
} from '../__fixtures__/includes.js';

describe('windowStatement', () => {
  test.each([
    `RANK()`,
    `DENSE_RANK()`,
    `ROW_NUMBER()`,
    `LEAD(salary, 1)`,
    `LEAD(salary, 1, 0)`,
    `LAG(salary, 1)`,
    `LAG(salary, 1, 0)`,
  ])('it parses schema to grammar with input "%s"', (initial) => {
    const fullGrammar = windowStatement.toString({
      include,
    });
    let parser = GBNF(fullGrammar);
    parser = parser.add(initial.split('\\n').join('\n').split('\\t').join('\t'));
    expect(parser.size).toBeGreaterThan(0);
  });

  test.each([
    `RANK()`,
    `DENSE_RANK()`,
    `ROW_NUMBER()`,
    `LEAD(salary,1)`,
    `LEAD(salary,1,0)`,
    `LAG(salary,1)`,
    `LAG(salary,1,0)`,
  ])('it parses schema with succinct whitespace to grammar with input "%s"', (initial) => {
    const fullGrammar = windowStatement.toString({
      include,
    });
    let parser = GBNF(fullGrammar);
    parser = parser.add(initial.split('\\n').join('\n').split('\\t').join('\t'));
    expect(parser.size).toBeGreaterThan(0);
  });
});
