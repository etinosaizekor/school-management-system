"use strict";
import { DataTypes, Model, Sequelize } from "sequelize";

module.exports = (sequelize: Sequelize) => {
  class Student extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models: any) {
      // define association here
    }
  }
  Student.init(
    {
      name: DataTypes.STRING,
      age: DataTypes.INTEGER,
      class: DataTypes.STRING,
      // courses: DataTypes.STRING
    },
    {
      sequelize,
      modelName: "Student",
    }
  );
  return Student;
};
