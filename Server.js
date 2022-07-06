require("dotenv").config();
const PostUsers = require("./backend/models/Users");
const PostLicenses = require("./backend/models/Licenses");
const PostExtensions = require("./backend/models/Extensions");
const PostExtensionsRanges = require("./backend/models/ExtensionsRanges");
const db = require("./backend/config/db");
const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");
const platformClient = require("purecloud-platform-client-v2");
var jsonParser = bodyParser.json();
const clientId = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_ID;
const clientSecret = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_SECRET;
const environment = process.env.REACT_APP_GENESYS_CLOUD_ENVIRONMENT;

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
app.use("/get_extensionstable", require("./backend/routes/extensionsRoutes"));

app.listen(4000, () => {
  console.log("server is Running on 4000");
});

 function callApi() {
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
      // Start the first function
      getUsers(jsonResponse);
      getExtensions(jsonResponse);
    })
    .catch((e) => console.error(e));
  //Callback to the other functions
}

callApi();

const getUsers = (body) => {
  // console.log("Limpando o Banco");
  let sql = `TRUNCATE TABLE users;`;
  db.execute(sql);

  var varPageNumber = 1;
  var varpageCount = 6;
  do {
    // console.log(varPageNumber);
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
        // console.log(jsonResponse);
        varpageCount = jsonResponse.pageCount;
        dbInsertUsers(jsonResponse);
      })
      .catch((err) => console.log(err));
    varPageNumber++;
  } while (varPageNumber <= varpageCount);
  setTimeout(getLicense, 4000);
};
const getLicense = () => {
  console.log("Inserting licenses on Users...");
  body = jsondata;
  var varPageNumber = 1;
  var varpageCount = 10;
  count = 0;
  do {
    // console.log(varPageNumber);
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
        // console.log(jsonResponse);
        varpageCount = jsonResponse.pageCount;
        dbInsertLicense(jsonResponse);
      })
      .catch((err) => console.log(err));
    varPageNumber++;
    count++;
  } while (varPageNumber <= varpageCount);
  setTimeout(runQueryes, 5000);
};
const runQueryes = () => {
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
 WHERE managers.id = users.manager 
 `;

  let queryDepartment = `
 UPDATE extensions, users 
 SET extensions.department = users.department 
 WHERE users.id = extensions.userid 
 `;

  db.execute(queryCopy);
  db.execute(queryNames);
  db.execute(queryUpdate);
  db.execute(queryDepartment);

  console.log("Inserting Managers on Users...");
  console.log("Inserting Department on Extensions...");
};
const getExtensions = async (body) => {
  // console.log("Limpando o Banco");
  let queryCleanTable = `TRUNCATE TABLE extensions;`;
  db.execute(queryCleanTable); //Apaga o que tudo ja tem no banco com a query acima

  const queryGetExtensions = await PostExtensions.findExtensionRanges();

  extensionRanges = queryGetExtensions[0];

  extensionRanges.map((e) => {
    // pra cada entrada de range da tabela ele vai fazer a função  abaixo
    startValue = e.start;
    endValue = e.end;
    prefixValue = e.prefix; // pega os valores que voltaram do banco e atribui variaveis

    for (let i = startValue; i <= endValue; i++) {
      // pega os valores do range e insere no banco
      // console.log("prefix: " + prefixValue + " end: " + i + "\n");
      dbInsertExtensionsRanges(prefixValue, i); // Chama função que insere no banco
    }
  });

  const client = platformClient.ApiClient.instance;
  client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1); // Genesys Cloud region

  // Manually set auth token or use loginImplicitGrant(...) or loginClientCredentialsGrant(...)
  client.setAccessToken(body.access_token);

  let apiInstance = new platformClient.TelephonyProvidersEdgeApi();

  var varPageNumber = 1;
  var varpageCount = 5;

  do {
    // console.log(varPageNumber);

    let opts = {
      pageSize: 100, // Number | Page size
      pageNumber: varPageNumber, // Number | Page number
      sortBy: "number", // String | Sort by
      sortOrder: "ASC", // String | Sort order
    };

    // Get a listing of extensions
    apiInstance
      .getTelephonyProvidersEdgesExtensions(opts)
      .then((jsonResponse) => {
        varpageCount = jsonResponse.pageCount;
        // console.log(varpageCount);
        dbInsertExtensions(jsonResponse);
      })
      .catch((err) => {
        console.log(
          "There was a failure calling getTelephonyProvidersEdgesExtensions"
        );
        console.error(err);
      });
    varPageNumber = varPageNumber + 1;
  } while (varPageNumber <= varpageCount);
};
//   const getExtensionsDep = () => {
//     console.log("Inserindo departamentos nos Ramais...");

// //     let queryDepartment = `
// //  UPDATE extensions, users
// //  SET extensions.department = users.department
// //  WHERE users.id = extensions.userid
// //  `;

// //     db.execute(queryDepartment);
//   };

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

    // console.log(
    //   "\n" + "id: " + id,
    //   "\n" + "name: " + name,
    //   "\n" + "state: " + state,
    //   "\n" + "department: " + department,
    //   "\n" + "address: " + email,
    //   "\n" + "manager: " + manager,
    //   "\n" + "extension: " + extension,
    //   "\n" + "license: " + license
    // );

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

    // console.log("\n" + "id: " + id, "\n" + "license: " + license);

    let post = new PostLicenses(id, license);
    post = post.saveLicenses();
  });
}
function dbInsertExtensionsRanges(prefix, end) {
  // console.log("\n" + "prefix: " + prefix, "\n" + "end: " + end);

  let post = new PostExtensionsRanges(prefix, end);
  post = post.saveExtensionsRanges();
}
function dbInsertExtensions(jsonResponse) {
  // console.log(jsonResponse);
  jsonResponse.entities.map((json) => {
    let { state, number, ownerType } = json;
    if (state == "active")
    {
      state = "Em Uso"
    }
    let userid = json.owner.id;
    let name = json.owner.name;

    // console.log(
    //   "\n" + "userid: " + userid,
    //   "\n" + "name: " + name,
    //   "\n" + "state: " + state,
    //   "\n" + "number: " + number,
    //   "\n" + "ownerType: " + ownerType,
    //   "\n" + "\n" + "---------------------------------"
    // );

    let post = new PostExtensions(userid, name, state, number, ownerType);
    post = post.saveExtensions();
  });
}


