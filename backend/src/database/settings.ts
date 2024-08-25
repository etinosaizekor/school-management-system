import "dotenv/config";

export const db = {
  DB_USERNAME: process.env.DB_USER,
  DB_PASSWORD: process.env.DB_USER,
  DB_NAME: process.env.DATABASE_NAME,
  TEST_DB_NAME: process.env.TEST_DATABASE_NAME,
  DB_HOST: process.env.HOST,
};
