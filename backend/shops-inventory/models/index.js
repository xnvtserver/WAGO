// models/index.js
import knexConfig from '../../knexfile.js';
import knex from 'knex';

const environment = process.env.NODE_ENV || 'development';
const db = knex(knexConfig[environment]);

export default db;
