import {
  DataTypes,
  Optional,
  Sequelize,
  Model,
  ModelStatic,
  HasManyAddAssociationsMixin,
  HasManyGetAssociationsMixin,
  HasManyCreateAssociationMixin,
  HasManyRemoveAssociationMixin,
  HasManyRemoveAssociationsMixin,
  HasOneGetAssociationMixin,
  HasOneSetAssociationMixin,
  HasManySetAssociationsMixin,
} from "sequelize";
import { Student } from "./student";
import connection from "../connection";
import { Class } from "./class";

interface CourseAttributes {
  id: number;
  courseName: string;
  courseCode: string;
  credit: number;
  studentIds?: number[];
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

  declare addStudents: HasManyAddAssociationsMixin<Student, number>;
  declare getStudents: HasManyGetAssociationsMixin<Student>;
  declare createStudent: HasManyCreateAssociationMixin<Student, "id">;
  declare removeStudent: HasManyRemoveAssociationMixin<Student, string>;
  declare removeStudents: HasManyRemoveAssociationsMixin<Student, string>;
  declare setStudents: HasManySetAssociationsMixin<Student, number>;

  static associate(models: any) {
    this.belongsTo(models.Class);
    this.belongsToMany(models.Student, { through: "StudentCourses" });
  }
}

// export const initCourseModel = (sequelize: Sequelize) => {
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
    credit: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize: connection,
    modelName: "Course",
    timestamps: true,
  }
);

Course.belongsToMany(Student, { through: "StudentCourses" });

export default Course;
