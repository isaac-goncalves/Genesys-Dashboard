const platformClient = require("purecloud-platform-client-v2");

const PostExtensions = require("../models/Extensions");

const { dbInsertExtensionsRanges } = require("../db/dbInsertExtensionsRanges")

const { dbInsertExtensions } = require("../db/dbInsertExtensions")

const createExtensionTable = () => {
  return new Promise(async (resolve, reject) => {
    console.log("Creating Extensions Tables...");
    const queryGetExtensions = await PostExtensions.findExtensionRanges();
    let counter = 0

    extensionRanges = queryGetExtensions[0];

    extensionRanges.map(async (e) => {
      let numbersInserted = 0;

      for (let i = e.start; i <= e.end; i++) {
        await dbInsertExtensionsRanges(e.prefix, i);
        numbersInserted++;
        if (i == e.end) {
          console.log(numbersInserted + "Rows inserted")
        }
      }
      counter++

    });

    setTimeout(() => {resolve(); }, 2000);

  })
}

const getExtensions = async (token) => {
  console.log("Getting Extensions...");

  const client = platformClient.ApiClient.instance;
  client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1); // Genesys Cloud region

  // Manually set auth token or use loginImplicitGrant(...) or loginClientCredentialsGrant(...)
  client.setAccessToken(token);

  let apiInstance = new platformClient.TelephonyProvidersEdgeApi();

  var varPageNumber = 1;
  var varpageCount = 5;

  do {
    console.log("Page: " + varPageNumber);

    let opts = {
      pageSize: 100, // Number | Page size
      pageNumber: varPageNumber, // Number | Page number
      sortBy: "number", // String | Sort by
      sortOrder: "ASC", // String | Sort order
    };

    // Get a listing of extensions
    await apiInstance
      .getTelephonyProvidersEdgesExtensions(opts)
      .then(async (jsonResponse) => {
        varpageCount = jsonResponse.pageCount;
        // console.log(varpageCount);
        await dbInsertExtensions(jsonResponse);
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


module.exports = { getExtensions, createExtensionTable }