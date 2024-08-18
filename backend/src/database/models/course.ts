import { DataTypes, Optional, Sequelize, Model, ModelStatic } from "sequelize";

interface CourseAttributes {
  id: number;
  courseName: string;
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> 
  implements CourseAttributes {
  declare id: number;
  declare courseName: string;
  

  static associate(models: any) {
    this.belongsTo(models.Class);
    this.belongsToMany(models.Student, {through: 'StudentCourses'})
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
    },
    {
      sequelize,
      modelName: "Course",
      timestamps: true
    }
  );

  return Course;
};
