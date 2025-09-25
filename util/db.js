const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.PG_DATABASE,
  process.env.PG_USER,
  process.env.PG_PASSWORD,
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: 'postgres',
    define: {
      // You can add model-wide options here if needed for PostgreSQL
    },
    logging: console.log,
  }
);

sequelize.authenticate()
  .then(() => console.log('✅ Connected to PostgreSQL DB'))
  .catch((err) => console.error('❌ PostgreSQL connection error:', err));

module.exports = sequelize;
