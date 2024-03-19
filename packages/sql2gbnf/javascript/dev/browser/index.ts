import { Parser, importer } from "@dbml/core";

const postgreSQL = `
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

// generate DBML from PostgreSQL script
const dbml = importer.import(postgreSQL, 'postgres');
const database = (new Parser()).parse(dbml, 'dbml');



console.log(database.schemas[0].tables)
