const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const DeanToken = sequelize.define("DeanTokens", {
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    deanId: {
      type: DataTypes.INTEGER, // Assuming a foreign key to the Students table
      allowNull: false,
    },
  });

  // Define associations
  DeanToken.associate = (models) => {
    DeanToken.belongsTo(models.Deans, {
      foreignKey: "deanId",
      allowNull: false,
    });
  };

  return DeanToken;
};
