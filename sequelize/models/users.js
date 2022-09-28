const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Users = sequelize.define(
  "userstable",
  {
    idGenesys: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    state: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    department: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    manager: {
      type: Sequelize.STRING,
      allowNull: true,
    }, 
    datelastlogin: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    extension: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    license: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Users;
