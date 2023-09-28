'use strict';

/** @type {import('sequelize').QueryInterface} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      token: {
        type: Sequelize.UUID, // Assuming a UUID data type for the token
        defaultValue: Sequelize.UUIDV4, // Generate a UUID when a new token is created
        allowNull: false,
      },
      studentId: {
        type: Sequelize.INTEGER, // Assuming a foreign key to the Students table
        allowNull: false,
        references: {
          model: 'Students',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Tokens');
  },
};
