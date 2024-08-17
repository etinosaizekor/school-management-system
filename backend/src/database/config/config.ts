import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    username: process.env.DB_USER,
    password: process.env.DB_PSW,
    database: process.env.DATABASE_NAME,
    host: process.env.HOST,
    dialect: "mysql",
  },
};

module.exports = config;
export default config