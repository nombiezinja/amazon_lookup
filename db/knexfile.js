require('dotenv').config({
  silent: true
});

module.exports = {

  test: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_TEST_NAME,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      host: process.env.DB_HOST || 'localhost',
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  development: {
    client: 'postgresql',
    connection: {
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      password: process.env.DB_PASSWORD,
      user: process.env.DB_USER,
      host: process.env.DB_HOST || 'localhost',
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations'
    },
    seeds: {
      directory: './db/seeds'
    }
  },

  production: {
    client: 'postgresql',
    connection: process.env.DATABASE_URL + '?ssl=true',
    pool: {
      min: 1,
      max: 20
    },
    migrations: {
      directory: './db/migrations',
      tableName: 'migrations'
    },
  }

};