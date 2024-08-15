import dotenv from "dotenv";
dotenv.config();
import 'ts-node/register'

module.exports = {
  development: {
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    host: process.env.HOST,
    dialect: "mysql",
  },
};
