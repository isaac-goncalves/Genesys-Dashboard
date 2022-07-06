const db = require("../config/db");

class PostExtensionsRanges {
  constructor(prefix, end) {
    this.prefix = prefix;
    this.end = end;
  }
  saveExtensionsRanges() {
    // console.log("inserido no Banco!");
    let sql = `
    INSERT INTO
    extensions(
      prefix,
      end,
      userid, 
      name, 
      state,  
      ownerType,
      department
    )
  VALUES(
      '${this.prefix}',
      '${this.end}',
      '-',
      '-',
      '-',
      '-',
      '-'
    )
      `;
    return db.execute(sql);
  }
}
module.exports = PostExtensionsRanges;
