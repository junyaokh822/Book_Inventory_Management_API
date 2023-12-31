const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT
});

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS book_inventory (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    author VARCHAR(100) NOT NULL,
    genre VARCHAR(100) NOT NULL,
    quantity INTEGER,
    price INTEGER,
    postLocation VARCHAR(100),
    releaseDate DATE Not null
  );
`;

const createTable = async () => {
    try {
      await pool.query(createTableQuery);
      console.log('Table created successfully');
    } catch (err) {
      console.error('Error executing query', err.stack);
    }
  };
  
  createTable();


  module.exports = {
    query: (text, params, callback) => {
      console.log("QUERY:", text, params || "");
      return pool.query(text, params, callback);
    },
  };