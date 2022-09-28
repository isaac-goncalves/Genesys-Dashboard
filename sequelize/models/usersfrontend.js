const Sequelize = require("sequelize");
const sequelize = require("../db/database");

const UsersFrontend = sequelize.define("usersfrontends", {
  idGenesys: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  id: {
    type: Sequelize.STRING,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  state: {
    type: Sequelize.STRING,
    allowNull: false
  },
  department: {
    type: Sequelize.STRING,
    allowNull: true
  },
  address: {
    type: Sequelize.STRING,
    allowNull: true
  },
  manager: {
    type: Sequelize.STRING,
    allowNull: true
  },
  datelastlogin: {
    type: Sequelize.STRING,
    allowNull: true,
  },
  extension: {
    type: Sequelize.STRING,
    allowNull: true
  },
  license: {
    type: Sequelize.STRING,
    allowNull: true
  },
},
{
  createdAt: false,
  updatedAt: false
}
);

module.exports = UsersFrontend;
