'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Bookings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      sessionId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Sessions', // Assuming you have a Sessions table
          key: 'id',
        },
      },
      studentId: {
        type: Sequelize.INTEGER,
        allowNull: true, // Nullable if the booking is for a dean
        references: {
          model: 'Students', // Assuming you have a Students table
          key: 'id',
        },
      },
      status: {
        type: Sequelize.STRING, // You can use an ENUM for status
        allowNull: false,
        defaultValue: 'pending', // Initial status can be 'pending' confirmed
      },
      expiry: {
        type: Sequelize.BOOLEAN, 
        defaultValue: false, 
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Bookings');
  },
};
