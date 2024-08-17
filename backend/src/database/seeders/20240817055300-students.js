'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Classes', [
      {
        className: 'Mathematics 101',
      },
      {
        className: 'Introduction to Physics',
      },
      {
        className: 'Basic Chemistry',
      },
      {
        className: 'English Literature',
      },
      {
        className: 'Computer Science Fundamentals',
      },
    ]);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Classes', null, {});

  }
};
