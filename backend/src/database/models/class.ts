"use strict";
import {
  DataTypes,
  HasManyAddAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyGetAssociationsMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  Model,
  Optional,
  Sequelize,
} from "sequelize";
import { Student } from "./student";
import connection from "../connection";

interface ClassAttributes {
  id: number;
  className: string;
  studentIds?: number[];
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

  static associate(models: any) {
    this.hasMany(models.Student);
  }
}

// export const initClassModel = (sequelize: Sequelize) => {
Class.init(
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER,
    },
    className: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    modelName: "Class",
    timestamps: true,
  }
);

Class.hasMany(Student);

export default Student;
