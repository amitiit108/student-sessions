const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Dean = sequelize.define('Deans', {
    universityId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_salt: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Dean;
};
