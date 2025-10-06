import 'dotenv/config';
export default {
  development: {
    client: 'pg',
    connection: {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: String(process.env.DB_PASSWORD), // Explicit string conversion
      database: process.env.DB_NAME,
    },
    migrations: {
      directory: './db/migrations',
      loadExtensions: ['.js'] // Important for ES modules
    },
    seeds: {
      directory: './db/seeds'
    }
  }
};