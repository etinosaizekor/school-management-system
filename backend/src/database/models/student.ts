"use strict";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface StudentAttributes {
  id: number;
  firstName: string;
  lastName: string,
  // classId: number;
}

export interface StudentCreationAttributes
  extends Optional<StudentAttributes, "id"> {}

export class Student
  extends Model<StudentAttributes, StudentCreationAttributes>
  implements StudentAttributes
{
  public id!: number;
  public firstName!: string;
  public lastName!: string;
  // public classId: number;
  static associate(models: any) {
    this.belongsTo(models.Class);
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
      // classId: {
      //   type: DataTypes.INTEGER,
      //   allowNull: false,
      // },
    },
    {
      sequelize,
      modelName: "Student",
      timestamps: true
    }
  );
  return Student;
};
