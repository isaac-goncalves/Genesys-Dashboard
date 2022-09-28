const Sequelize = require("sequelize")

const sequelize = new Sequelize("genesys-dashboard","root","@LGEBR#22*nt",{
    dialect: "mysql",
    host: "localhost",
    logging: false
})


module.exports = sequelize;


