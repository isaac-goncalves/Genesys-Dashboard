const db = require("../config/db");

class PostUsers {
  constructor(id, name, state, department, address, manager, extension, license) {
    this.id = id;
    this.name = name;
    this.state = state;
    this.department = department;
    this.address = address;
    this.manager = manager;
    this.extension = extension;
    this.license = license;
  }
  saveUsers() {
    // console.log("inserido no Banco!");
    let sql = `
    INSERT INTO
    users(
      id,
      name,
      state,
      department,
      address,
      manager,
      datelastlogin,
      extension,
      license
    )
  VALUES(
      '${this.id}',
      '${this.name}',
      '${this.state}',
      '${this.department}',
      '${this.address}',
      '${this.manager}',
      '-',
      '${this.extension}',
      '${this.license}'
    )
      `;
    return db.execute(sql);
  }

  static findAll() {
    let sql = `SELECT * FROM usersfrontends
    ORDER BY name;`;
    return db.execute(sql);
  }
  static findAllUsersIds() {
    let sql = `SELECT id FROM usersfrontends
    WHERE state = 'active';`;
    return db.execute(sql);
  }

}

module.exports = PostUsers;
