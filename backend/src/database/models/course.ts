import { DataTypes, Optional, Sequelize, Model, ModelStatic } from "sequelize";

interface CourseAttributes {
  id: number;
  name: string;
  // other attributes
}

export interface CourseCreationAttributes extends Optional<CourseAttributes, 'id'> {}

export class Course extends Model<CourseAttributes, CourseCreationAttributes> 
  implements CourseAttributes {
  public id!: number;
  public name!: string;

  // Add any associations if needed
  static associate(models: any) {
    // Define associations here
  }
}

export const initCourseModel = (sequelize: Sequelize) => {
  console.log('Initializing Course model');

  Course.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      // Define other attributes here
    },
    {
      sequelize,
      modelName: "Course",
    }
  );

  return Course;
};
