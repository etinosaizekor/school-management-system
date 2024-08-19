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
  Model,
  Optional,
  Sequelize,
} from "sequelize";
import { Course } from "./course";

interface StudentAttributes {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  classId?: string;
  courses?: Course[];
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
  declare countCourses: HasManyCountAssociationsMixin;
  declare createCourse: HasManyCreateAssociationMixin<Course, "id">;
  declare removeCourse: HasManyRemoveAssociationMixin<Course, string>;
  declare removeCourses: HasManyRemoveAssociationsMixin<Course, string>;

  static associate(models: any) {
    this.belongsTo(models.Class);
    this.belongsToMany(models.Course, {
      through: "StudentCourses",
    });
  }
}

export const initStudentModel = (sequelize: Sequelize) => {
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
      dateOfBirth: DataTypes.DATE
    },
    {
      sequelize,
      modelName: "Student",
      timestamps: true,
    }
  );
  return Student;
};
