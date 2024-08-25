import { Sequelize } from "sequelize";
import config from "./config/config";

const { username, password, database, host } = config;

let sequelize: Sequelize = new Sequelize(database!, username!, password, {
  host: host,
  dialect: "mysql",
  port: 3306,
  logging: false,
});

export default sequelize;
