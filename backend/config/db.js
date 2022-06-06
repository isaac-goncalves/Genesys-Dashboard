
require('dotenv').config();

const mysql = require('mysql2')

const pool = mysql.createPool({
host: "localhost",
user: "root",
database: "genesys-dashboard",
password: "@LGEBR#22*nt",
}) 

let sql = "SELECT * FROM users;"

pool.execute(sql, function(err, result){
    if(err) throw err;

    console.log(result)
    console.log(result.forEach(res => {
        console.log(res.name)
    }))
})

module.exports = pool.promise();