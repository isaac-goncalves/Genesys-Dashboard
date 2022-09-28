
const sequelize = require("../../sequelize/db/database");

const truncateTables = async () => {
  console.log("Truncating Tables...");
  await sequelize.query(
    `
      TRUNCATE TABLE userstables;
      `
  );
  await sequelize.query(
    `
      TRUNCATE TABLE extensions;      `
  );
}

const runQueryes = async () => {
  console.log("Running Queryes...");

  console.log("TRUNCATE: managers");
  await sequelize
    .query(`TRUNCATE TABLE managers;`)
    .then(async () => {
      console.log("INSERT INTO: managers");
      await sequelize.query(
        `
     INSERT INTO managers (idmanager)
     SELECT manager FROM userstables
     WHERE manager <> "-"
     `
      );
    })
    .then(async () => {
      console.log("UPDATE: userstables");
      await sequelize.query(
        `
     UPDATE userstables, managers
     SET managers.name = userstables.name
     WHERE managers.idmanager = userstables.id
     `
      );
    })
    .then(async () => {
      console.log("UPDATE: userstables");
      await sequelize.query(
        `
       UPDATE userstables, managers
       SET userstables.manager = managers.name
       WHERE managers.idmanager = userstables.manager
       `
      );
    })
    .then(async () => {
      console.log("UPDATE: extensions");
      await sequelize.query(
        `
       UPDATE extensions, userstables
       SET extensions.department = userstables.department
       WHERE userstables.id = extensions.userid
       `
      );
    })
    .then(async () => {
      console.log("UPDATE: userstables");
      await sequelize.query(
        `
            UPDATE userstables, extensions
            SET userstables.extension = extensions.end
            WHERE extensions.userid = userstables.id
             `
      );
    })
    .then(async () => {
      console.log("UPDATE: extensions");
      await sequelize.query(
        `
          UPDATE extensions, extensionsexceptions
          SET extensions.state = extensionsexceptions.state,   
          extensions.userid = extensionsexceptions.userid,
          extensions.ownerType = extensionsexceptions.ownerType,
          extensions.name = extensionsexceptions.name,
          extensions.department = extensionsexceptions.department
          WHERE extensionsexceptions.end = extensions.end
           `
      );
    })

    .then(async () => {
      console.log("UPDATE: userstables");
      await sequelize.query(`
         update userstables, lastlogindates
         set userstables.datelastlogin = lastlogindates.lastlogindate
         where userstables.id = lastlogindates.idUsers`)
    })

    .then(async () => {
      console.log("TRUNCATE: usersfrontends");
      await sequelize.query(
        `
            TRUNCATE TABLE usersfrontends;
            `
      );
    }).then(async () => {
      console.log("TRUNCATE: extensionsfrontends");
      await sequelize.query(
        `
            TRUNCATE TABLE extensionsfrontends;
            `
      );
    })
};

module.exports = { runQueryes, truncateTables }