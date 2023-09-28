const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Session = sequelize.define('Sessions', {
    slotId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    deanId: {
      type: DataTypes.INTEGER, 
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false, 
    },
  });

  // Define associations
  Session.associate = (models) => {
    Session.belongsTo(models.Slots, {
      foreignKey: "slotId",
      allowNull: false,
    });
    Session.belongsTo(models.Deans, {
      foreignKey: "deanId",
      allowNull: false,
    });
  };

  return Session; 
};
