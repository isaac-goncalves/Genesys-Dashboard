const db = require("../config/db");

class PostLicenses {
  constructor(id, license) {
    this.id = id;
    this.license = license;
  }
  saveLicenses() {
    // console.log("inserido no Banco!");
    let sql = `
    UPDATE users
    SET license = '${this.license}'
    WHERE id = '${this.id}'
     `;
    return db.execute(sql);
  }
}

module.exports = PostLicenses;