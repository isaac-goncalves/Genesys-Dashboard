const sequelize = require("sequelize");
const Extensions = require("./sequelize/models/extensionranges")

// sequelize.query ()
Extensions.bulkCreate([
  { prefix: "3411", start: "3500", end: "3599" },
  { prefix: "3411", start: "3600", end: "3699" },
  { prefix: "3411", start: "3700", end: "3799" },
  { prefix: "3411", start: "3800", end: "3899" },
  { prefix: "3411", start: "3900", end: "3999" },
  { prefix: "3411", start: "6000", end: "6099" },
]);