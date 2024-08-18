import { DataTypes, Optional, Sequelize, Model, ModelStatic } from "sequelize";

interface CourseAttributes {
  id: number;
  courseName: string;
  courseCode: string;
  credit: number;
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

  static associate(models: any) {
    this.belongsTo(models.Class);
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
