// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();

const { Pool } = require('pg');

// eslint-disable-next-line no-trailing-spaces
// Remplacez la ligne User & default database par celui de elephantsql 
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});
// eslint-disable-next-line max-len
// eslint-disable-next-line prefer-arrow-callback, func-names, consistent-return, space-before-function-paren
pool.connect(function(err) {
  if (err) {
    return console.error('Could not connect to PostgreSQL', err);
  }
  // eslint-disable-next-line no-console
  console.log('Connected to PostgreSQL');
});

module.exports = pool;
