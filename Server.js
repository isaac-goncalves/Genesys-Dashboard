require("dotenv").config();
const PostUsers = require("./backend/models/Users");
const PostLicenses = require("./backend/models/Licenses");
const db = require("./backend/config/db");
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");
var jsonParser = bodyParser.json();

var state = {
  items: [],
  JsonEdge: [],
  Edge0PreviousStatuscode: "ACTIVE",
  Edge1PreviousStatuscode: "ACTIVE",
  Edge2PreviousStatuscode: "ACTIVE",
};
var state2 = {
  items: [],
  sendMailtrigger: 5,
  Trunk0InboundCalls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Trunk1InboundCalls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  Trunk2InboundCalls: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  TimeData: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
};
global.issueReported = false;
var jsondata = [];

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/get_edge_status", async (req, res) => {
  res.json({
    json: {
      items: state.JsonEdge,
      Trunk0InboundCalls: state2.Trunk0InboundCalls,
      Trunk1InboundCalls: state2.Trunk1InboundCalls,
      Trunk2InboundCalls: state2.Trunk2InboundCalls,
      TimeData: state2.TimeData,
    },
  });
});
app.use("/get_userstable", require("./backend/routes/usersRoutes"));

app.listen(4000, () => {
  console.log("server is Running on 4000");
});

function callApi() {
  const clientId = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_ID;
  const clientSecret = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_SECRET;
  const environment = process.env.REACT_APP_GENESYS_CLOUD_ENVIRONMENT;
  console.log(process.env.REACT_APP_GENESYS_CLOUD_ENVIRONMENT);
  // const clientId = '01116766-51c1-46b7-95f1-adff32b85374';
  // const clientSecret = 'BJZCipWwlMrvasBSn6e44jPYC0CYC6N76Vcp7f4tO4M';
  // const environment = 'mypurecloud.com'

  var today = new Date();
  var date =
    today.getDate() + "/" + (today.getMonth() + 1) + "/" + today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var hours = today.getHours();
  var day = today.getDay();
  console.log("Hora: " + hours);
  console.log("Dia da semana: " + day);
  var dateTime = time + " do dia " + date;

  const params = new URLSearchParams();
  params.append("grant_type", "client_credentials");

  //  Parte que pega o token -------------------------------------------------------------------------

  fetch(
    `https://login.mypurecloud.com/oauth/token?grant_type=client_credentials`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Basic ${Buffer.from(
          clientId + ":" + clientSecret
        ).toString("base64")}`,
        // 'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization, ININ-Client-Path',
        // 'Access-Control-Allow-Origin': 'https://api.mypurecloud.com',
        // 'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, HEAD, PATCH'
      },
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw Error(res.statusText);
      }
    })
    .then((jsonResponse) => {
      // console.log(jsonResponse);
      jsondata = jsonResponse;
      getUsers(jsonResponse);
    })
    .catch((e) => console.error(e));

  //  parte que faz o GET dos users na API -------------------------------------------------------------------------

  const getUsers = (body) => {
    console.log("Limpando o Banco");
    let sql = `TRUNCATE TABLE users;`;
    db.execute(sql);

    var varPageNumber = 1;
    var varpageCount = 6;
    do {
      console.log(varPageNumber);
      const searchParams = {
        pageSize: 100,
        pageNumber: varPageNumber,
        sortOrder: "ASC",
        types: ["users"],
        returnFields: ["ALL_FIELDS"],
        query: [
          {
            type: "EXACT",
            fields: ["state"],
            values: ["inactive", "active", "deleted"],
          },
        ],
      };

      fetch(`https://api.${environment}/api/v2/users/search`, {
        method: "POST",
        body: JSON.stringify(searchParams),
        headers: {
          "Content-Type": "application/json",
          Authorization: `${body.token_type} ${body.access_token}`,
        },
      })
        .then((res) => {
          return res.json();
        })
        .then((jsonResponse) => {
          console.log(jsonResponse);
          varpageCount = jsonResponse.pageCount;
          dbInsertUsers(jsonResponse);
        })
        .catch((err) => console.log(err));
      varPageNumber++;
    } while (varPageNumber <= varpageCount);
  };

  const getLicense = () => {
    console.log("Iserindo licenses");
    body = jsondata;
    var varPageNumber = 1;
    var varpageCount = 10;
    do {
      console.log(varPageNumber);
      fetch(
        `https://api.${environment}/api/v2/license/users?pageSize=100&pageNumber=${varPageNumber}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `${body.token_type} ${body.access_token}`,
          },
        }
      )
        .then((res) => {
          return res.json();
        })
        .then((jsonResponse) => {
          console.log(jsonResponse);
          varpageCount = jsonResponse.pageCount;
          dbInsertLicense(jsonResponse);
        })
        .catch((err) => console.log(err));
      varPageNumber++;
    } while (varPageNumber <= varpageCount);
  };

  const getManagers = () => {
    let queryCopy = `
   INSERT INTO managers (id)
   SELECT manager FROM users 
   WHERE manager <> "-" 
   `;
    let queryNames = `
   UPDATE users, managers 
   SET managers.name = users.name 
   WHERE managers.id = users.id 
   `;
    let queryUpdate = `
   UPDATE users, managers 
   SET users.manager = managers.name 
   WHERE managers.id = users.manager `;

    db.execute(queryCopy);
    db.execute(queryNames);
    db.execute(queryUpdate);

    console.log("Managers atualizados!");
  };

  function dbInsertUsers(jsonResponse) {
    jsonResponse.results.map((json) => {
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
        // if (extension.length > 4) {
        //   extension = json.addresses[1].extension;
        // }
      }

      let license = "-";

      console.log(
        "\n" + "id: " + id,
        "\n" + "name: " + name,
        "\n" + "state: " + state,
        "\n" + "department: " + department,
        "\n" + "address: " + email,
        "\n" + "manager: " + manager,
        "\n" + "extension: " + extension,
        "\n" + "license: " + license
      );

      let post = new PostUsers(
        id,
        name,
        state,
        department,
        email,
        manager,
        extension,
        license
      );
      post = post.saveUsers();
    });
  }
  function dbInsertLicense(jsonResponse) {
    // console.log(jsonResponse);
    jsonResponse.entities.map((json) => {
      let { id } = json;

      let license = json.licenses[0];

      console.log("\n" + "id: " + id, "\n" + "license: " + license);

      let post = new PostLicenses(id, license);
      post = post.saveLicenses();
    });
  }

  setTimeout(getLicense, 7000);
  setTimeout(getManagers, 12000);
}

callApi();
