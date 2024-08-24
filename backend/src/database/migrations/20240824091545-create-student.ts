import "ts-node/register";
import { DataTypes, QueryInterface, Sequelize } from "sequelize";

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
          model: "Classes",
          key: "id",
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

    async (queryInterface: QueryInterface) => {
      await queryInterface.dropTable("Students");
    };
  },
};
