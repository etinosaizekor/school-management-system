import "ts-node/register"; // Ensure ts-node is registered for TypeScript execution
import { DataTypes, QueryInterface, Sequelize } from "sequelize";

// Define the migration functions
module.exports = {
  async up(queryInterface: QueryInterface, sequelize: typeof Sequelize) {
    await queryInterface.createTable("Students", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATE,
      },
      classId: {
        type: DataTypes.INTEGER,
        references: {
          model: "Classes", // Name of Target model
          key: "id", // Key in Target model that we're referencing
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },
    });

    // await queryInterface.addColumn(
    //   "Students", // Name of Source model
    //   "classId" // Name of the key we're adding
    // );
    async (queryInterface: QueryInterface) => {
      await queryInterface.dropTable("Students");
    };
  },
};
