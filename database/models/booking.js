const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Booking = sequelize.define('Bookings', {
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sessionId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
  });

  Booking.associate = (models) => {
    // Add the association with Student
    Booking.belongsTo(models.Students, {
      foreignKey: 'studentId',
      onDelete: 'CASCADE',
    }); 

    // Add the association with Session
    Booking.belongsTo(models.Sessions, {
      foreignKey: 'sessionId',
      onDelete: 'CASCADE',
    });
  };

  return Booking;
};
