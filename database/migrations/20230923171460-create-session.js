// In the generated migration file
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Sessions', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      slotId: {
        type: Sequelize.INTEGER, // Add the foreign key for Dean
        references: {
          model: 'Slots', // Assuming the Dean model is named 'Deans'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE', 
      },
      deanId: {
        type: Sequelize.INTEGER, // Add the foreign key for Dean
        references: {
          model: 'Deans', // Assuming the Dean model is named 'Deans'
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      status: {
        allowNull: false,  // You can use an ENUM for status
        type: Sequelize.STRING,
        defaultValue: 'pending', // Initial status can be 'pending'
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
    await queryInterface.dropTable('Sessions');
  },
};
