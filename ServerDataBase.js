
//old db interactions
const db = require("./backend/config/db");
const PostUsers = require("./backend/models/Users");
const PostLicenses = require("./backend/models/Licenses");
const PostExtensions = require("./backend/models/Extensions");

//new db interactions
const Users = require("./sequelize/models/users");
const ExtensionsRanges = require("./sequelize/models/extensionranges");
const sequelize = require("./sequelize/db/database");
const Usernames = require("./sequelize/models/usernames");

const nodemailer = require("nodemailer");
const express = require("express");
const app = express();
const fetch = require("node-fetch");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors());
const platformClient = require("purecloud-platform-client-v2");
var jsonParser = bodyParser.json();

const { getLicenses } = require("./backend/libs/getLicenses")
const { getUsers } = require("./backend/libs/getUsers")
const { truncateTables } = require("./backend/libs/runQueryes")
const { getExtensions, createExtensionTable } = require("./backend/libs/getExtensions")
const { runQueryes } = require("./backend/libs/runQueryes");
const { copyusers } = require("./backend/libs/copyUsers");
const { getLasLoginDate } = require("./backend/libs/getLasLoginDate");
const { getToken } = require("./backend/libs/getToken");

app.use(cors());
//USER LOGIN ------------------------
app.use(express.json());

app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log("Requested");
  console.log(username, password);

  Usernames.findOne({
    where: {
      username: username,
      password: password,
    },
  }).then((result) => {
    if (result) {
      res.send(result);
      console.log(result);
    } else {
      res.send({ message: "Wrong username/password combination!" });
    }
  });
});

//USER LOGIN ------------------------

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.use("/refresh",async (req, res) => { 
console.log("refreshing")
 await StartApp()
res.status(200).send("refreshed")
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/get_userstable", require("./backend/routes/usersRoutes"));
app.use("/get_extensionstable", require("./backend/routes/extensionsRoutes"));

app.listen(4010, () => {
  console.log("server is Running on 4010");
});


async function StartApp() {
  console.log("======== Starting Execution ========")

  await periodicUpdate();

  dailyUpdate();

  console.log("======== Finished Execution ========")
  return new Promise((resolve, reject) => {
    resolve("done");
  })

}

StartApp();

async function periodicUpdate() {

  const token = await getToken();

  await truncateTables();

  await getUsers(token);

  await getLicenses(token);

  await createExtensionTable();

  await getExtensions(token);

  await runQueryes();

  await copyusers();

  setTimeout(periodicUpdate, 1.5 * 60 * 1000);

}

async function dailyUpdate() {
  const token = await getToken();
  await getLasLoginDate(token);
  setTimeout(dailyUpdate, 86400000);
}