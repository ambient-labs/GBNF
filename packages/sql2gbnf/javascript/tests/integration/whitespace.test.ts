import {
  describe,
  test,
  expect,
} from 'vitest';
// import SQL2GBNF from 'sql2gbnf';
import {
  SQL2GBNF,
} from '../../src/sql2gbnf.js';
import GBNF, {
  InputParseError,
} from 'gbnf';

describe('Whitespace, no schema', () => {
  describe('verbose', () => {
    test.each([
      `select foo, bar,  froo`,
      'SELECT foo, bar FROM table;',
      `SELECT foo, bar, baz FROM table;`,
      'SELECT col FROM table WHERE col=',
      'SELECT col FROM table WHERE col =1',
      'SELECT col FROM table WHERE col =1;',
      `SELECT first_name,last_name`,
      `SELECT first_name,\\nlast_name,fo\\n`,
      `SELECT first_name,\\n last_name,fo\\n`,
      `SELECT first_name,\\t last_name,fo\\n`,
      `SELECT first_name, \\n last_name FROM \\n f \\t f1 WHERE x>`,
      `SELECT first_name, last_name FROM f f1 WHERE \\t x >1`,
      `SELECT first_name, \\n last_name FROM f \\n f1 WHERE x > 1 LIMIT 0,1`,
      `select fooy as foo,bary as bar from table`,
      'SELECT foo,bar,baz FROM table where foo = 1 and bar = "bar" AND baz = \'baz\' order by bar desc limit 2, 5;',
      `SELECT conference FROM p JOIN foo ON foo.school_name=p.school_name`,
      `SELECT conference FROM p JOIN foo ON foo.school_name = p.school_name`,
      `SELECT conference FROM p JOIN foo ON foo.school_name \\n\\t= \\n\\tp.school_name`,
      `SELECT order_id FROM orders HAVING SUM(oi.quantity * oi.unit_price)>'2023-12-31'`,
      `SELECT order_id FROM orders HAVING SUM(oi.quantity * oi.unit_price)>500`,
      `SELECT order_id, COUNT(*) FROM orders GROUP BY order_id HAVING foo="foo";`,
      `SELECT first_name, \\n last_name \\n FROM \\n employees \\n WHERE   department \\n = 'Sales';`,
      `SELECT employee_id, salary, SUM(salary) OVER() AS total_salary FROM salaries;`,
    ])('it accepts any amount of whitespace: %s', (initial) => {
      const grammar = SQL2GBNF(undefined, {
        whitespace: 'verbose',
      });
      // console.log(grammar);
      let parser = GBNF(grammar);
      parser = parser.add(initial.split('\\n').join('\n').split('\\t').join('\t'));
      expect(parser.size).toBeGreaterThan(0);
    });
  })

  describe('default', () => {
    test.each([
      `SELECT first_name, last_name FROM employees WHERE department = 'Sales';`,
      `SELECT first_name, COUNT(age) FROM employees WHERE department = 'Sales';`,
      `SELECT first_name, COUNT(age) FROM employees WHERE x > 1 LIMIT 0, 1`,
    ])('it accepts a SQL query with singular whitespace', (initial) => {
      const grammar = SQL2GBNF(undefined, {
        whitespace: 'default',
      });
      let parser = GBNF(grammar);
      parser = parser.add(initial);
      expect(parser.size).toBeGreaterThan(0);
    });

    test.each([
      [`SELECT first_name,last_name`, 18],
      [`SELECT first_name, last_name,fo`, 29],
      [`SELECT first_name, last_name FROM f f1 WHERE x>`, 46],
      [`SELECT first_name, last_name FROM f f1 WHERE x >1`, 48],
      [`SELECT first_name, last_name FROM f f1 WHERE x > 1 LIMIT 0,1`, 59],
    ])('it rejects missing whitespace: %s', (initial, errorPos) => {
      const grammar = SQL2GBNF(undefined, {
        whitespace: 'default',
      });
      let parser = GBNF(grammar);
      expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
    });

    test.each([
      [`SELECT first_name,  last_name`, 19],
      [`SELECT first_name, \\nlast_name`, 19],
      [`SELECT first_name, last_name,  fo`, 30],
      [`SELECT first_name, last_name, \\nfo`, 30],
      [`SELECT first_name, last_name FROM f f1 WHERE x  >`, 47],
      [`SELECT first_name, last_name FROM f f1 WHERE x \\t>`, 47],
      [`SELECT first_name, last_name FROM f f1 WHERE x >  1`, 49],
      [`SELECT first_name, last_name FROM f f1 WHERE x > \\n1`, 49],
      [`SELECT first_name, last_name FROM f f1 WHERE x > 1 LIMIT 0,  1`, 60],
      [`SELECT first_name, last_name FROM f f1 WHERE x > 1 LIMIT 0,  \\n1`, 60],
    ])('it rejects excess whitespace: %s', (initial, errorPos) => {
      const grammar = SQL2GBNF(undefined, {
        whitespace: 'default',
      });
      let parser = GBNF(grammar);
      expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
    });
  })

  describe('succinct', () => {
    test.each([
      'SELECT col FROM table WHERE col IN ("foo","bar")',
      'SELECT col FROM table WHERE col in ("foo","bar")',
      'SELECT col FROM table WHERE col in ("foo","bar",\'baz\')',
      `SELECT first_name,last_name FROM employees WHERE department='Sales';`,
      `SELECT SUM(foo+bar) FROM orders`,
      `SELECT employee_id,salary,LEAD(salary,1) OVER(ORDER BY employee_id) AS next_salary`,
      `SELECT employee_id,salary,LEAD(salary,1) OVER(ORDER BY employee_id) AS next_salary,LAG(salary,1) OVER(ORDER BY employee_id) AS previous_salary FROM salaries;`,
    ])(`it accepts a SQL query without whitespace: '%s'`, (initial) => {
      const grammar = SQL2GBNF(undefined, {
        whitespace: 'succinct',
      });
      // console.log(grammar)
      let parser = GBNF(grammar);
      parser = parser.add(initial);
      expect(parser.size).toBeGreaterThan(0);
    });

    test.each([
      [`SELECT first_name, last_name`, 18],
      [`SELECT first_name,last_name, fo`, 28],
      [`SELECT first_name,last_name FROM f f1 WHERE x >`, 46],
      [`SELECT first_name,last_name FROM f f1 WHERE x> `, 46],
      [`SELECT first_name,last_name FROM f f1 WHERE x>1 LIMIT 0, `, 53],
    ])('it rejects unnecessary whitespace: %s', (initial, errorPos) => {
      const grammar = SQL2GBNF(undefined, {
        whitespace: 'succinct',
      });
      let parser = GBNF(grammar);
      expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
    });
  })

});

