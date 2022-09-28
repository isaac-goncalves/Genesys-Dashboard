const Lastlogindate = require("../../sequelize/models/lastlogindate");

const dbInsertDateLastLogin = async (id, datelastlogin) => {
    await Lastlogindate.create(
        {
            idUsers: id,    
            lastlogindate: datelastlogin
        }
    );
}

module.exports = { dbInsertDateLastLogin };