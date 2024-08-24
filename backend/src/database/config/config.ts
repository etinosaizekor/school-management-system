// config.js
import { db } from '../../settings.js'; // Use .js extension for ES modules
import 'dotenv/config'; // Ensure dotenv is configured

const config = {
  username: db.DB_USERNAME,
  password: db.DB_PASSWORD,
  database: db.DB_NAME,
  host: db.DB_HOST,
  dialect: 'mysql',
};

module.exports = config;
