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

describe('Cases, no schema', () => {
  describe('Upper case', () => {
    const grammar = SQL2GBNF(undefined, {
      whitespace: 'verbose',
      case: 'upper',
    });
    test('it accepts uppercase SQL keywords', () => {
      const initial = `SELECT order_id FROM orders
        WHERE o.order_date BETWEEN '2023-01-01' AND '2023-12-31'
        GROUP BY o.order_id, o.order_date, c.customer_name 
        HAVING SUM(oi.quantity * oi.unit_price) > 500 
        ORDER BY total_amount DESC;`;
      let parser = GBNF(grammar);
      parser = parser.add(initial);
      expect(parser.size).toBeGreaterThan(0);
    });

    test('it rejects lowercase SQL keywords', () => {
      const initial = `select order_id from orders
        where o.order_date between '2023-01-01' and '2023-12-31'
        group by o.order_id, o.order_date, c.customer_name 
        having sum(oi.quantity * oi.unit_price) > 500 
        order by total_amount desc;`;
      let parser = GBNF(grammar);
      expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, 0));
    });
  });

  describe('Lower case', () => {
    const grammar = SQL2GBNF(undefined, {
      case: 'lower',
      whitespace: 'verbose',
    });
    test('it accepts uppercase SQL keywords', () => {
      const initial = `select order_id from orders
        where o.order_date between '2023-01-01' and '2023-12-31'
        group by o.order_id, o.order_date, c.customer_name 
        having sum(oi.quantity * oi.unit_price) > 500 
        order by total_amount desc;`;
      let parser = GBNF(grammar);
      parser = parser.add(initial);
      expect(parser.size).toBeGreaterThan(0);
    });

    test('it rejects lowercase SQL keywords', () => {
      const initial = `SELECT order_id FROM orders
        WHERE o.order_date BETWEEN '2023-01-01' AND '2023-12-31'
        GROUP BY o.order_id, o.order_date, c.customer_name 
        HAVING SUM(oi.quantity * oi.unit_price) > 500 
        ORDER BY total_amount DESC;`;
      let parser = GBNF(grammar);
      expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, 0));
    });
  });
})

