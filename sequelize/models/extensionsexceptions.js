const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const ExtensionsExceptions = sequelize.define(
  "extensionsexceptions",
  {
    prefix: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    end: {
      type: Sequelize.STRING,
      allowNull: false,
      primaryKey: true,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userid: {
      type: Sequelize.STRING,
    },
    ownerType: {
      type: Sequelize.STRING,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    department: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false
  }
);

module.exports = ExtensionsExceptions;
