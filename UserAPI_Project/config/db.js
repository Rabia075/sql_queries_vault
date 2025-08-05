const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'MY_database',
  password: 'admin11',
  port: 5432,
});

module.exports = pool;