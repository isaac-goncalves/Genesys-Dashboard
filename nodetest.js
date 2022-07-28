const app = require("express")();

app.listen(4000, () => {
    console.log("server is Running on 4000");
  });

app.get("/test", function (req, res) {
    return  res.send({ message: "Testing Express" });
  })
  exports.users = app;


const functions = require("@google-cloud/functions-framework");
const escapeHtml = require("escape-html");
const app = require("express")();
/**
 * Responds to an HTTP request using data from the request body parsed according
 * to the "content-type" header.
 *
 * @param {Object} req Cloud Function request context.
 * @param {Object} res Cloud Function response context.
 */
functions.http("webhook-genesys", (req, res) => {
  // res.send({ message: "Testing Express", log: req });

  console.log(req);
  const jsonResponse = {
    fulfillmentMessages: [
      {
        text: {
          text: ["Essa mensagem veio do Webhook"],
        },
      },
    ],
  };

  res.send(jsonResponse);
});