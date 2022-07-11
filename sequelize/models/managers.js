const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Managers = sequelize.define(
  "managers",
  {
    idmanager: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false
  }
);

module.exports = Managers;
