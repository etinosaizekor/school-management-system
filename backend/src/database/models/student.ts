"use strict";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface StudentAttributes {
  id: number;
  name: string;
  age: number;
  class: string;
}

export interface StudentCreationAttributes
  extends Optional<StudentAttributes, "id"> {}

export class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  public id!: number;
  public name!: string;
  public age!: number;
  public class: string;
  static associate(models: any) {
    // define association here
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
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      class: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // courses: {
      //   type: DataTypes.STRING,
      //   allowNull: true,
      // }
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
