/**
 * Synthetic SQL select statements generated from an LLM.
 * 
 * Every test should note which LLM generated it.
 */

const syntheticLLMSelectTests = [
  /**
   * OpenAI GPT-4o
   */
  `SELECT first_name, last_name FROM employees WHERE department = 'Sales';`,
  `SELECT e.first_name, e.last_name, d.department_name, s.salary FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN salaries s ON e.employee_id = s.employee_id WHERE s.salary > 50000 AND d.department_name = 'Engineering' ORDER BY s.salary DESC;`,
  `SELECT p.product_name, c.category_name, s.supplier_name, p.price FROM products p JOIN categories c ON p.category_id = c.category_id JOIN suppliers s ON p.supplier_id = s.supplier_id WHERE p.price BETWEEN 100 AND 500 AND c.category_name = 'Electronics' ORDER BY p.product_name ASC;`,
  `SELECT order_id FROM orders WHERE o.order_date BETWEEN '2023-01-01' AND '2023-12-31'`,
  `SELECT order_id FROM orders GROUP BY o.order_id, o.order_date, c.customer_name`,
  `SELECT SUM(foo * bar) FROM orders`,
  `SELECT order_id FROM orders HAVING SUM(oi.quantity * oi.unit_price) > '2023-12-31'`,
  `SELECT order_id FROM orders HAVING SUM(oi.quantity * oi.unit_price) > 500`,
  `SELECT COUNT(*) FROM orders`,
  `SELECT COUNT(foo) FROM orders`,
  `SELECT order_id FROM orders HAVING SUM(oi.quantity * oi.unit_price) > 500`,
  `SELECT * FROM orders GROUP BY order_id HAVING foo IS NOT NULL;`,
  `SELECT order_id, COUNT(*) FROM orders GROUP BY order_id HAVING foo IS NOT NULL;`,
  `SELECT order_id, COUNT(*) FROM orders GROUP BY order_id HAVING foo = "foo";`,
  `SELECT order_id, COUNT(*) FROM orders GROUP BY order_id HAVING foo = true;`,
  `SELECT customer_name, COUNT(*) AS order_count FROM orders GROUP BY customer_name HAVING customer_name LIKE '%John%';`,
  `SELECT customer_name, COUNT(*) AS order_count FROM orders GROUP BY customer_name HAVING customer_name LIKE 'Jo%hn';`,
  `SELECT department, AVG(salary) AS average_salary FROM employees GROUP BY department HAVING AVG(salary) != 50000;`,
  `SELECT * FROM employees WHERE NOT department = 'Sales';`,
  `SELECT order_id FROM orders WHERE o.order_date BETWEEN '2023-01-01' AND '2023-12-31' GROUP BY o.order_id, o.order_date, c.customer_name HAVING SUM(oi.quantity * oi.unit_price) > 500 ORDER BY total_amount DESC;`,
  `SELECT o.order_id, o.order_date, c.customer_name, SUM(oi.quantity * oi.unit_price) AS total_amount FROM orders o JOIN order_items oi ON o.order_id = oi.order_id JOIN customers c ON o.customer_id = c.customer_id WHERE o.order_date BETWEEN '2023-01-01' AND '2023-12-31' GROUP BY o.order_id, o.order_date, c.customer_name HAVING SUM(oi.quantity * oi.unit_price) > 500 ORDER BY total_amount DESC;`,
  `SELECT employee_id, salary, SUM(salary) OVER () AS total_salary FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id) AS total_salary_per_department FROM salaries;`,
  `SELECT employee_id, salary, SUM(salary) OVER (ORDER BY employee_id) AS running_total_salary FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id) AS running_total_salary_per_department FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_salary FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id rows between unbounded preceding and current row) AS cumulative_salary FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id ROWS BETWEEN UNBOUNDED PRECEDING AND CURRENT ROW) AS cumulative_salary FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id ROWS BETWEEN 3 PRECEDING AND CURRENT ROW) AS moving_sum FROM salaries;`,
  `SELECT employee_id, department_id, salary, AVG(salary) OVER (PARTITION BY department_id ORDER BY employee_id ROWS BETWEEN 3 PRECEDING AND 3 FOLLOWING) AS moving_avg FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id ROWS BETWEEN CURRENT ROW AND 5 FOLLOWING) AS future_sum FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id ROWS BETWEEN CURRENT ROW AND UNBOUNDED FOLLOWING) AS cumulative_future_salary FROM salaries;`,
  `SELECT employee_id, salary, SUM(salary) OVER (ORDER BY employee_id ROWS BETWEEN 1 PRECEDING AND CURRENT ROW) AS rolling_sum_salary FROM salaries;`,
  `SELECT employee_id, salary, RANK() OVER (ORDER BY salary DESC) AS salary_rank FROM salaries;`,
  `SELECT employee_id, salary, DENSE_RANK() OVER (ORDER BY salary DESC) AS salary_rank FROM salaries;`,
  `SELECT employee_id, salary, ROW_NUMBER() OVER (ORDER BY salary DESC) AS salary_rank FROM salaries;`,
  `SELECT employee_id, salary, LEAD(salary, 1) OVER (ORDER BY employee_id) AS next_salary`,
  `SELECT employee_id, salary, LEAD(salary, 1, 0) OVER (ORDER BY employee_id) AS next_salary`,
  `SELECT employee_id, salary, LEAD(salary, 1) OVER (ORDER BY employee_id) AS next_salary, LAG(salary, 1) OVER (ORDER BY employee_id) AS previous_salary FROM salaries;`,
  `SELECT employee_id, salary, LEAD(salary, 1, 0) OVER (ORDER BY employee_id) AS next_salary, LAG(salary, 1) OVER (ORDER BY employee_id) AS previous_salary FROM salaries;`,
  `SELECT employee_id, department_id, salary, SUM(salary) OVER (PARTITION BY department_id ORDER BY employee_id RANGE BETWEEN INTERVAL '1' DAY PRECEDING AND CURRENT ROW) AS range_based_salary FROM salaries;`,
  `SELECT e.employee_id OVER (PARTITION BY e.employee_id) AS total_hours`,
  `SELECT e.employee_id FROM employees e ORDER BY last_name ASC, salary DESC`,
  `SELECT e.employee_id FROM employees e GROUP BY e.employee_id, e.first_name, e.last_name, d.department_name, s.salary, p.project_name HAVING COUNT(p.project_id) > 1 ORDER BY e.last_name ASC, s.salary DESC LIMIT 10`,
  `SELECT e.employee_id FROM employees e WHERE e.hire_date > '2020-01-01'`,
  `SELECT e.emplyees FROM employees e WHERE e.hire_date > '2020-01-01' AND s.salary > 50000`,
  `SELECT e.employee_id, e.first_name, e.last_name, d.department_name, s.salary, p.project_name, SUM(p.hours_worked) OVER (PARTITION BY e.employee_id) AS total_hours, AVG(s.salary + s.bonus) OVER (PARTITION BY d.department_id) AS avg_compensation_per_dept FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN salaries s ON e.employee_id = s.employee_id LEFT JOIN projects p ON e.employee_id = p.employee_id WHERE e.hire_date > '2020-01-01' AND s.salary > 50000 GROUP BY e.employee_id, e.first_name, e.last_name, d.department_name, s.salary, p.project_name HAVING COUNT(p.project_id) > 1 ORDER BY e.last_name ASC, s.salary DESC LIMIT 10`,
  `SELECT e.employee_id FROM departments LIMIT 10 OFFSET 5;`,
  `SELECT e.employee_id, e.first_name, e.last_name, d.department_name, s.salary, p.project_name, SUM(p.hours_worked) OVER (PARTITION BY e.employee_id) AS total_hours, AVG(s.salary + s.bonus) OVER (PARTITION BY d.department_id) AS avg_compensation_per_dept FROM employees e JOIN departments d ON e.department_id = d.department_id JOIN salaries s ON e.employee_id = s.employee_id LEFT JOIN projects p ON e.employee_id = p.employee_id WHERE e.hire_date > '2020-01-01' AND s.salary > 50000 GROUP BY e.employee_id, e.first_name, e.last_name, d.department_name, s.salary, p.project_name HAVING COUNT(p.project_id) > 1 ORDER BY e.last_name ASC, s.salary DESC LIMIT 10 OFFSET 5;`,
];
export default syntheticLLMSelectTests;
