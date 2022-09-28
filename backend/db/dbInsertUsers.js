const Users = require("../../sequelize/models/users");

async function dbInsertUsers(jsonResponse) {
    await jsonResponse.results.map(async (json) => {
      let { id, name, state, email } = json;
  
      let manager = "-";
      if (json.manager) {
        manager = json.manager.id;
      }
      let department = "-";
      if (json.department != undefined) {
        department = json.department;
      }
  
      let extension = "-";
      if (json.addresses[0]) {
        extension = json.addresses[0].extension;
      }
  
      let license = "-";
  
      await Users.create({
        id: id,
        name: name,
        state: state,
        department: department,
        address: email,
        manager: manager,
        datelastlogin: "-",
        extension: extension,
        license: license,
      });

    });
  }

  module.exports = {dbInsertUsers}