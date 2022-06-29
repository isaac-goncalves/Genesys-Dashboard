const db = require("../config/db");

class PostExtensions {
  constructor(userid, name, state, end, ownerType) {
    this.userid = userid;
    this.name = name;
    this.state = state;
    this.end = end;
    this.ownerType = ownerType;
  }
  saveExtensions() {
    console.log("inserido no Banco!");
    let sql = `
    INSERT INTO
    extensions(
      userid, 
      name, 
      state, 
      end, 
      ownerType
    )
  VALUES(
      '${this.userid}',
      '${this.name}',
      '${this.state}',
      '${this.end}',
      '${this.ownerType}'
    )
      `;
    return db.execute(sql);
  }

  static findExtensionRanges() {
    let sql = `SELECT * FROM extensionranges;`;
    return db.execute(sql);
  }
}

module.exports = PostExtensions;
