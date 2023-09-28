const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Slot = sequelize.define("Slots", {
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Slot.associate = (models) => {
    Slot.belongsTo(models.Sessions, {
      foreignKey: 'slotId', // Specify the foreign key that connects Slot to Session
      as: 'sessions', // Alias for the association (optional)
    });
    
    // ... Other associations ...
  };

  return Slot;
};
