"use strict";
import { DataTypes, Model, Optional, Sequelize } from "sequelize";

interface ClassAttributes {
  id: number;
  className: string;
}

export interface ClassCreationAttributes
  extends Optional<ClassAttributes, "id"> {}

export class Class extends Model<ClassCreationAttributes, ClassCreationAttributes> {
  public id!: number;
  public className!: string;
  static associate(models: any) {
    this.hasMany(models.Student);
  }
}

export const initClassModel = (sequelize: Sequelize) => {
  Class.init(
    {
      className: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Class",
      timestamps: true
    }
  );
  return Class;
};
