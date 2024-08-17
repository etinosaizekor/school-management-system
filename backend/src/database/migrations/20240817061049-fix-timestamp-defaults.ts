import { DataTypes, QueryInterface, Sequelize } from "sequelize";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.createTable("Classes", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER, // Use DataTypes here
      },
      className: {
        type: DataTypes.STRING, // Use DataTypes here
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE, // Use DataTypes here
        defaultValue: DataTypes.NOW, // Set default value for createdAt
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE, // Use DataTypes here
        defaultValue: DataTypes.NOW, // Set default value for updatedAt
      },
    });
  },

  async down(queryInterface: QueryInterface, Sequelize: Sequelize) {
    await queryInterface.dropTable("Classes");
  },
};
