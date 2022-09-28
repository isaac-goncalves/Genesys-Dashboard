const platformClient = require("purecloud-platform-client-v2");

const {dbInsertUsers} = require("../db/dbInsertUsers")

const getUsers = async (token) => {
    console.log("Getting users...");
    var varpageCount = 1;
  
    for (i = 1; i <= varpageCount; i++) {
      console.log("Page: " + i);
      const searchParams = {
        pageSize: 100,
        pageNumber: i,
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
  
      const client = platformClient.ApiClient.instance;
      client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1); // Genesys Cloud region
  
      // Manually set auth token or use loginImplicitGrant(...) or loginClientCredentialsGrant(...)
      client.setAccessToken(token);
  
      let apiInstance = new platformClient.UsersApi();
  
      // Search users
      await apiInstance.postUsersSearch(searchParams)
        .then(async (jsonResponse) => {
          varpageCount = jsonResponse.pageCount;
          await dbInsertUsers(jsonResponse);
        })
        .catch((err) => {
          console.log("There was a failure calling postUsersSearch");
          console.error(err);
        });
    }
  
    
  };

  module.exports = { getUsers }