const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const Lastlogindate = sequelize.define(
  "lastlogindate",
  {
    idUsers: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    lastlogindate: {
      type: Sequelize.STRING,
      allowNull: true,
    },
  },
  {
    createdAt: false,
    updatedAt: false
  }
);

module.exports = Lastlogindate;
