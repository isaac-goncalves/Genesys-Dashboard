const sequelize = require("./db/database");

const User = require("./models/users");
const UsersFrontend = require("./models/usersfrontend");
const Extensions = require("./models/extensions");
const ExtensionsFrontend = require("./models/extensionsfrontend");
const ExtensionsRanges = require("./models/extensionranges");
const Managers = require("./models/managers");
const Usernames = require("./models/usernames");


// {force: true}
sequelize.sync().then((result) => {
    console.log(result)
})
.catch((err) =>{
    console.log(err)
})
