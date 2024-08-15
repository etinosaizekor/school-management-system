"use strict";

import fs from "fs";
import path from "path";
import { DataTypes, Sequelize } from "sequelize";
import { Course, initCourseModel } from "./course";
import process from "process";
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
import config from "../config/config";
import { Class, initClassModel } from "./class";
import { Student, initStudentModel } from "./student";

let sequelize: Sequelize = new Sequelize(
  config.database!,
  config.username!,
  config.password!,
  { host: config.host, dialect: "mysql" }
);

initCourseModel(sequelize);
initClassModel(sequelize);
initStudentModel(sequelize);

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  course: Course,
  class: Class,
  student: Student,
};

export default db;
