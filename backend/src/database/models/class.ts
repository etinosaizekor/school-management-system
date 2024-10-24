"use strict";
import {
  DataTypes,
  HasManyAddAssociationsMixin,
  HasManyCountAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  Model,
  Optional,
  Sequelize,
} from "sequelize";
import { Student } from "./student";

interface ClassAttributes {
  id: number;
  className: string;
  studentIds?: number[];
  userId: number;
}

export interface ClassCreationAttributes
  extends Optional<ClassAttributes, "id"> {}

export class Class extends Model<
  ClassCreationAttributes,
  ClassCreationAttributes
> {
  declare id: number;
  declare className: string;
  declare addStudents: HasManyAddAssociationsMixin<Student, number>;
  declare getStudents: HasManyGetAssociationsMixin<Student>;
  declare createStudent: HasManyCreateAssociationMixin<Student, "id">;
  declare removeStudent: HasManyRemoveAssociationMixin<Student, string>;
  declare removeStudents: HasManyRemoveAssociationsMixin<Student, string>;
  declare setStudents: HasManySetAssociationsMixin<Student, number>;
  declare countStudents: HasManyCountAssociationsMixin;

  static associate(models: any) {
    this.hasMany(models.Student);
  }
}

export const initClassModel = (sequelize: Sequelize) => {
  Class.init(
    {
      className: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Class",
      timestamps: true,
    }
  );

  return Class;
};
