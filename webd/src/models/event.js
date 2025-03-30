const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  return sequelize.define("Event", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    maxSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 100,
    },
    soldSeats: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
};
