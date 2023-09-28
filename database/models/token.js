const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Token = sequelize.define("Tokens", {
    token: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    studentId: {
      type: DataTypes.INTEGER, // Assuming a foreign key to the Students table
      allowNull: false,
    },
  });

  // Define associations
  Token.associate = (models) => {
    Token.belongsTo(models.Students, {
      foreignKey: "studentId",
      allowNull: false,
    });
  };

  return Token;
};
