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
  config.development.database!,
  config.development.username!,
  config.development.password!,
  { host: config.development.host, dialect: "mysql", logging: false }
);

initCourseModel(sequelize);
initClassModel(sequelize);
initStudentModel(sequelize);

Student.associate({Class})
Class.associate({Student})


const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  course: Course,
  class: Class,
  student: Student,
};

export default db;
