require("dotenv").config();
const fetch = require("node-fetch");

const clientId = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_ID;
const clientSecret = process.env.REACT_APP_GENESYS_CLOUD_CLIENT_SECRET;

function getToken() {
  const promise = new Promise(async (resolve, reject) => {
    console.log("======== Grabbing Token from Genesys API ========")
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");
    await fetch(
      `https://login.mypurecloud.com/oauth/token?grant_type=client_credentials`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            clientId + ":" + clientSecret
          ).toString("base64")}`,
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
      .then(async (jsonResponse) => {
        // Start the first function
        return resolve(jsonResponse.access_token)
      })
      .catch((e) => console.error(e));
  });
  return promise;
}
module.exports = { getToken };