const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Usernames = sequelize.define(
  "usernames",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    username: {
      type: Sequelize.STRING,
      allowNull: false,
    },
     password: {
      type: Sequelize.STRING,
      allowNull: false,
    }
  },
  {
    createdAt: false,
    updatedAt: false,
  }
);

module.exports = Usernames;
