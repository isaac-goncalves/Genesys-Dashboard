const db = require("../config/db");

class PostUsers {
  constructor(id, name, state, department, address, manager, extension) {
    this.id = id;
    this.name = name;
    this.state = state;
    this.department = department;
    this.address = address;
    this.manager = manager;
    this.extension = extension;
  }
  
   saveUsers() {
     console.log('inserido no Banco!')
    let sql = `
    INSERT INTO
    users(
      id,
      name,
      state,
      department,
      address,
      manager,
      extension
    )
  VALUES(
      '${this.id}',
      '${this.name}',
      '${this.state}',
      '${this.department}',
      '${this.address}',
      '${this.manager}',
      '${this.extension}'
    )
      `;
    return db.execute(sql) 
  }

  static findAll() {
    let sql = `SELECT * FROM users;`;
    return db.execute(sql);
  }
}
module.exports = PostUsers;

