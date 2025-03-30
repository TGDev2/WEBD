const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Ticket", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    ticketNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    purchaseDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
