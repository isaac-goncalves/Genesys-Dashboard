const fetch = require("node-fetch");
require("dotenv").config();

const environment = process.env.REACT_APP_GENESYS_CLOUD_ENVIRONMENT;

const {dbInsertLicense} = require("../db/dbInsertLicense")

const getLicenses = async (token) => {

    console.log("Inserting licenses on Users...");
    var varPageNumber = 1;
    var varpageCount = 10;
    count = 0;
    do {
      await fetch(
        `https://api.${environment}/api/v2/license/users?pageSize=100&pageNumber=${varPageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `bearer ${token}`,
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then(async (jsonResponse) => {
          varpageCount = jsonResponse.pageCount;
          await dbInsertLicense(jsonResponse);
        })
        .catch((err) => console.log(err));
      varPageNumber++;
      count++;
    } while (varPageNumber <= varpageCount);
  
  };

  module.exports = {getLicenses}