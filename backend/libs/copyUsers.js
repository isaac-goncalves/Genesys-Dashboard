const sequelize = require("../../sequelize/db/database");

const copyusers = async () => {
  console.log("REPLACE usersfrontends");
    await sequelize.query(
      `
      REPLACE usersfrontends SELECT * FROM userstables ;
      `
    ).then(async () => {
      console.log("INSERT: extensionsfrontends");
      await sequelize.query(
        `
        INSERT extensionsfrontends SELECT * FROM extensions ;
        `
      );
    })
  }

  module.exports = {copyusers}