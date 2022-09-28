const PostUsers = require("../models/Users");
const platformClient = require("purecloud-platform-client-v2");
const { dbInsertDateLastLogin } = require("../db/dbinsertDateLastLogin");
const sequelize = require("../../sequelize/db/database");

const { sendMail } = require("../libs/sendMail");

getLasLoginDate = async (token) => {

    //Truncate lastlogindate table
    console.log("Truncating lastlogindate table...");
    await sequelize.query(
        `
            TRUNCATE TABLE lastlogindates;
            `
    );

    const usersIdsSearch = await PostUsers.findAllUsersIds();
    console.log("usersIdsSearch lenght: ", usersIdsSearch[0].length);
    let counter = 0
    let counterTotal = 0

    for (let i = 0; i < usersIdsSearch[0].length; i++) {
        if (counter < 100) {
            // console.log(usersIdsSearch[0][i].id);
            console.log("counter: ", counter);
            const client = platformClient.ApiClient.instance;
            client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1); // Genesys Cloud region

            // Manually set auth token or use loginImplicitGrant(...) or loginClientCredentialsGrant(...)
            client.setAccessToken(token);

            let apiInstance = new platformClient.UsersApi();

            let userId = usersIdsSearch[0][i].id; // String | User ID 
            let opts = {
                "expand": ["dateLastLogin"], // [String] | Which fields, if any, to expand
                "state": "active" // String | Search for a user with this state
            };

            // Get user.
            apiInstance.getUser(userId, opts)
                .then(async (data) => {
                    // const date = format(parseISO(data.dateLastLogin), 'dd/MM/yyyy');
                    // sendMail(userId, data.dateLastLogin);
                    await dbInsertDateLastLogin(usersIdsSearch[0][i].id, data.dateLastLogin);
                    console.log(data.dateLastLogin);
                })
                .catch((err) => {
                    console.log("There was a failure calling getUser");
                    console.error(err);
                });
            counter++
        } else {
            //wait 1 minute and continue the loop
            console.log("waiting 1 minute");
            await new Promise(r => setTimeout(r, 60000));
            counter = 0;
            i--
        }
        counterTotal++
    }
    console.log("counterTotal: ", counterTotal);
}


module.exports = { getLasLoginDate };