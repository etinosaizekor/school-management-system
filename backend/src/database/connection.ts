import { Sequelize } from "sequelize";
import { db } from "./../settings";
const { DB_USERNAME, DB_PASSWORD, DB_NAME, DB_HOST } = db;

let sequelize: Sequelize = new Sequelize(
  DB_NAME!,
  DB_USERNAME!,
  DB_PASSWORD,
  {
    host: DB_HOST,
    dialect: "mysql",
    port: 3306,
    logging: false
  },
);

export default sequelize;
