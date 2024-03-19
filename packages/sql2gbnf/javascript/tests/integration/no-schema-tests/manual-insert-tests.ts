/**
 * Manually written insert SQL statements to validate various aspects of the package.
 */
const basicTests = [
  'inser',
  'INSER',
  `INSERT INTO employees (first_name, last_name) VALUES ('John', 'Doe');`,
  `INSERT INTO employees (foo) VALUES ("HUZZAH");`,
  `INSERT INTO employees(first_name,last_name)VALUES(1,-10);`,
  `INSERT INTO employees (foo) VALUES (-0.01);`,
  `INSERT INTO employees (foo) VALUES (1.0e-10);`,
  `INSERT INTO employees (foo) VALUES ('2023-05-24');`,
  `INSERT INTO employees (foo) VALUES ('2000-12-31 23:59:59');`,
  `INSERT INTO employees (foo) VALUES (true);`,
  `INSERT INTO employees (foo) VALUES (false);`,
  `INSERT INTO employees (foo) VALUES (null);`,
  `INSERT INTO employees (foo) VALUES (NULL);`,
  `INSERT INTO employees (foo) VALUES (SELECT bar FROM baz);`,
  `INSERT INTO employees (foo, bar) VALUES (SELECT bar FROM baz, 2);`,
  `INSERT INTO employees (foo, bar, baz) VALUES (SELECT bar FROM baz, 2, (SELECT baz FROM baz2));`,
];
export default basicTests;

