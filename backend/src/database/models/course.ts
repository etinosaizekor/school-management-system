import {
  DataTypes,
  Optional,
  Sequelize,
  Model,
  HasManyAddAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasManySetAssociationsMixin,
} from "sequelize";
import { Student } from "./student";

interface CourseAttributes {
  id: number;
  courseName: string;
  courseCode: string;
  credit: number;
  studentIds?: number[];
  userId: number;
}

export interface CourseCreationAttributes
  extends Optional<CourseAttributes, "id"> {}

export class Course
  extends Model<CourseAttributes, CourseCreationAttributes>
  implements CourseAttributes
{
  declare id: number;
  declare courseName: string;
  declare courseCode: string;
  declare credit: number;
  declare userId: number;

  declare addStudents: HasManyAddAssociationsMixin<Student, number>;
  declare getStudents: HasManyGetAssociationsMixin<Student>;
  declare createStudent: HasManyCreateAssociationMixin<Student, "id">;
  declare removeStudent: HasManyRemoveAssociationMixin<Student, string>;
  declare removeStudents: HasManyRemoveAssociationsMixin<Student, string>;
  declare setStudents: HasManySetAssociationsMixin<Student, number>;

  static associate(models: any) {
    this.belongsToMany(models.Student, { through: "StudentCourses" });
  }
}

export const initCourseModel = (sequelize: Sequelize) => {
  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      courseName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      courseCode: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      credit: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Course",
      timestamps: true,
    }
  );

  return Course;
};
