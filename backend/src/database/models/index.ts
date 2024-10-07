"use strict";

import fs from "fs";
import path from "path";
import { DataTypes, Sequelize } from "sequelize";
import { Course, initCourseModel } from "./course";
import process from "process";
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || "development";
import { Class, initClassModel } from "./class";
import { Student, initStudentModel } from "./student";
import sequelize from "../connection";
import { initUserModel } from "./user";

const courseModel = initCourseModel(sequelize);
const classModel = initClassModel(sequelize);
const studentModel = initStudentModel(sequelize);
const userModel = initUserModel(sequelize);

courseModel.associate({ Class, Student });
studentModel.associate({ Class, Course });
classModel.associate({ Student });

const db = {
  sequelize: sequelize,
  Sequelize: Sequelize,
  course: courseModel,
  class: classModel,
  student: studentModel,
  user: userModel,
};

export default db;
