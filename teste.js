const platformClient = require("purecloud-platform-client-v2");

const client = platformClient.ApiClient.instance;
client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1); // Genesys Cloud region

// Manually set auth token or use loginImplicitGrant(...) or loginClientCredentialsGrant(...)
client.setAccessToken("your_access_token");

let apiInstance = new platformClient.TelephonyProvidersEdgeApi();

let opts = { 
  "pageSize": 25, // Number | Page size
  "pageNumber": 1, // Number | Page number
  "sortBy": "number", // String | Sort by
  "sortOrder": "ASC", // String | Sort order
  "_number": "_number_example" // String | Filter by number
};

// Get a listing of extensions
apiInstance.getTelephonyProvidersEdgesExtensions(opts)
  .then((data) => {
    console.log(`getTelephonyProvidersEdgesExtensions success! data: ${JSON.stringify(data, null, 2)}`);
  })
  .catch((err) => {
    console.log("There was a failure calling getTelephonyProvidersEdgesExtensions");
    console.error(err);
  });

  const runQueryes = () => {
    let queryCopy = `
   INSERT INTO managers (id)
   SELECT manager FROM users 
   WHERE manager <> "-" 
   `;
  
    db.execute(queryCopy)
  
    console.log("queryCopy...");
    setTimeout(runQueryes2, 2000);
    
  };
  const runQueryes2 = () => {
    let queryNames = `
   UPDATE users, managers 
   SET managers.name = users.name 
   WHERE managers.id = users.id 
   `;
  
    db.execute(queryNames);
  
    console.log("queryNames...");
    setTimeout(runQueryes3, 2000);
  };
  const runQueryes3 = () => {
    let queryUpdate = `
   UPDATE users, managers 
   SET users.manager = managers.name 
   WHERE managers.id = users.manager 
   `;
  
   db.execute(queryUpdate);
  
    console.log("queryUpdate...");
    setTimeout(runQueryes4, 2000);
  };
  const runQueryes4 = () => {
   
    let queryDepartment = `
   UPDATE extensions, users 
   SET extensions.department = users.department 
   WHERE users.id = extensions.userid 
   `;
  
   db.execute(queryDepartment);
  
    console.log("queryDepartment...");
  };
  