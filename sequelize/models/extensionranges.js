const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const ExtensionsRanges = sequelize.define(
  "extensionranges",
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    prefix: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    start: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    end: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = ExtensionsRanges;
