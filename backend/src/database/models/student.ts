"use strict";
import {
  CreationOptional,
  DataTypes,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
  Optional,
  Sequelize,
} from "sequelize";
import { Course } from "./course";
import { Class } from "./class";
import connection from "../connection";

interface StudentAttributes {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  classId?: number;
  courseIds?: number[];
}

export interface StudentCreationAttributes
  extends Optional<StudentAttributes, "id"> {}

export class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  declare id: number;
  declare firstName: string;
  declare lastName: string;
  declare dateOfBirth: Date;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
  declare addCourses: HasManyAddAssociationsMixin<Course, number>;
  declare getCourses: HasManyGetAssociationsMixin<Course>;
  declare createCourse: HasManyCreateAssociationMixin<Course, "id">;
  declare removeCourse: HasManyRemoveAssociationMixin<Course, string>;
  declare removeCourses: HasManyRemoveAssociationsMixin<Course, string>;
  declare getClass: HasOneGetAssociationMixin<Class>;
  declare setClass: HasOneSetAssociationMixin<Class, Class["id"]>;

  static associate(models: any) {
    this.belongsTo(models.Class);
    this.belongsToMany(models.Course, {
      through: "StudentCourses",
    });
  }
}

// export const initStudentModel = (sequelize: Sequelize) => {
Student.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    classId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    dateOfBirth: DataTypes.DATE,
  },
  {
    sequelize: connection,
    modelName: "Student",
    timestamps: true,
  }
);

Student.belongsTo(Class, {
  foreignKey: {
    name: "classId",
    allowNull: false,
  },
  foreignKeyConstraint: true,
});
Student.belongsToMany(Course, {
  through: "StudentCourses",
});

export default Student
