import { db } from "../settings";

export const config = {
  development: {
    username: db.DB_USERNAME,
    password: db.DB_PASSWORD,
    database: db.DB_NAME,
    host: db.DB_HOST,
    dialect: "mysql",
  },
};

export default config;
