import knex from 'knex';
import config from './knexfile.js';

// Initialize Knex with development config
const db = knex(config.development);

// Verify connection
db.raw('SELECT 1')
  .then(() => console.log('Database connected successfully'))
  .catch(err => {
    console.error('Database connection failed:', err);
    process.exit(1);
  });

export default db;