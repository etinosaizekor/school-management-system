"use strict";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ClassAttributes {
  id: number;
  name: string;
}

export interface ClassCreationAttributes
  extends Optional<ClassAttributes, "id"> {}

export class Class extends Model<ClassCreationAttributes, ClassCreationAttributes> {
  public id!: number;
  public name!: string;
  static associate(models: any) {
    // define association here
  }
}

export const initClassModel = (sequelize: Sequelize) => {
  Class.init(
    {
      name: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Class",
    }
  );
  return Class;
};
