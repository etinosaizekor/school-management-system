import dotenv from "dotenv";
dotenv.config();

const config = {
  username: process.env.DB_USER,
  password: process.env.DB_PSW,
  database: process.env.DATABASE_NAME,
  host: process.env.HOST,
  dialect: "mysql",
};

export default config;
