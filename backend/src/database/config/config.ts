import { db } from "../settings";

export const config = {
  username: db.DB_USERNAME,
  password: db.DB_PASSWORD,
  database: db.DB_NAME,
  host: db.DB_HOST,
  dialect: "mysql",
};

module.exports = config;
export default config;
