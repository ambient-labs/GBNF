import {
  describe,
  test,
  expect,
} from 'vitest';
import {
  SQL2GBNF,
} from '../../src/sql2gbnf.js';
import GBNF, { InputParseError } from 'gbnf';

const schema = `
-- Create users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create posts table 
CREATE TABLE posts (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  title VARCHAR(255) NOT NULL,
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create comments table
CREATE TABLE comments (
  id SERIAL PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id), 
  post_id INTEGER NOT NULL REFERENCES posts(id),
  body TEXT NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP  
);

-- Create index on posts user_id foreign key
CREATE INDEX posts_user_id_idx ON posts(user_id);

-- Create index on comments post_id and user_id foreign keys  
CREATE INDEX comments_post_id_idx ON comments(post_id);
CREATE INDEX comments_user_id_idx ON comments(user_id);
`;

describe('Schema Tests', () => {
  test.each([
    'SELECT id, user_id, title, body, created_at FROM posts;',
  ])('it renders for a schema: %s', (initial) => {
    const grammar = SQL2GBNF({
      schema,
      schemaFormat: 'postgres',
    }, {
      whitespace: 'verbose',
    });
    // console.log(grammar);
    let parser = GBNF(grammar);
    parser = parser.add(initial.split('\\n').join('\n').split('\\t').join('\t'));
    expect(parser.size).toBeGreaterThan(0);
  });

  // test.each([
  //   ['SELECT foo FROM posts;', 7],
  // ])('it throws if invalid for a schema: %s', (initial, errorPos) => {
  //   const grammar = SQL2GBNF(undefined, {
  //     whitespace: 'verbose',
  //     schema,
  //     schemaFormat: 'postgres',
  //   });
  //   // console.log(grammar);
  //   let parser = GBNF(grammar);
  //   expect(() => parser.add(initial)).toThrowError(new InputParseError(initial, errorPos));
  // });
});

