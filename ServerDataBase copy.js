require("dotenv").config();
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
const http = require("http");

const { Server } = require("socket.io");

const WebSocket = require("ws");
const { json } = require("body-parser");

app.use(bodyParser.json());

let firstChat = true;

activeChats = [];

app.use("/message", async (request, response) => {
  const { message } = request.body;
  const { name } = request.body;
  console.log("We got a hit @ " + new Date());
  // const activechat = activechats.find((activechats) => activechats.name === name )
  //   if(!activechat){

  //     // chamar o obj(Token)
  //   }else{
  //     return response.satatus(400).json({error: "Costumer not Found"})
  //   }

  if (message == undefined || name == undefined) {
    console.log("primeiro request descartado");
  }
  if (message != undefined && name != undefined && firstChat == true) {
    const chatInfo = await createConversationObj(name);

    const conversationID = chatInfo.id;
    const jwt = chatInfo.jwt;
    const memberId = chatInfo.member.id;
    const eventStreamUri = chatInfo.eventStreamUri;

    // const conversationID = "32a5aade-364f-4993-81f1-c59e530dfba0"
    // const jwt = "eyJhbGciOiJSUzI1NiIsImtpZCI6IjVmYjBkZmQwLTFkMDYtNDQzMi05NGFhLTVmMGQ0MTJhNmI5OSIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNvbnYiOiIzMmE1YWFkZS0zNjRmLTQ5OTMtODFmMS1jNTllNTMwZGZiYTAiLCJkaWQiOiJiZTM0ZGVlOC1jODIzLTQ4N2ItOThmZS0yYWZhMWYwOGRlMzUiLCJzdWIiOiJjNTE5NzNmZi03MGUzLTRjOWUtOGUzOS0yMzljMjBjMzMzNDMifSwiZXhwIjoxNjU5MDg1NTg2LCJpYXQiOjE2NTkwMTAzNjQsImlzcyI6InVybjpwdXJlY2xvdWQ6d2ViY2hhdCIsIm9yZyI6ImFkYjNlM2VlLTdiYjQtNGUyYS1iNzU0LTE3OGZmOGZjMzU5YiJ9.HsDinpC63xy_WeLvC8wG_AuLXorCweRGwIyo7SVxWfIEEkjeG5tjd1jS0c9MDtBrXiZMMSFBhZ7yLzpsBDfQHmWJv8Th5FN66glH8z0UTp0f1D8ltWsLlnnqe5gkWJi9Vh6yMB-D4BxnVDWUpqZL0sA784U2VqQoe7XEaOHD9MrbUygp-91PF5tD5EiB_ckUaHnf0xsxxa0SA6yVT_3JkFCV4uaSCi6accwjhIigOsOfYvA1iGyYPcGjeaY35_joHQRxVj5eVdV8fRronxa3XjhjC1T-2WlnraUk0pOPS3Z6Lf_P9b1XHvIFLmf2EtsKQN2X-_MZp9fA00Hhd5X-yg"
    // const memberId = "c51973ff-70e3-4c9e-8e39-239c20c33343"
    // const eventStreamUri = "wss://streaming.mypurecloud.com/chat/jwt/eyJhbGciOiJSUzI1NiIsImtpZCI6IjVmYjBkZmQwLTFkMDYtNDQzMi05NGFhLTVmMGQ0MTJhNmI5OSIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7ImNvbnYiOiIzMmE1YWFkZS0zNjRmLTQ5OTMtODFmMS1jNTllNTMwZGZiYTAiLCJkaWQiOiJiZTM0ZGVlOC1jODIzLTQ4N2ItOThmZS0yYWZhMWYwOGRlMzUiLCJzdWIiOiJjNTE5NzNmZi03MGUzLTRjOWUtOGUzOS0yMzljMjBjMzMzNDMifSwiZXhwIjoxNjU5MDg1NTg2LCJpYXQiOjE2NTkwMTAzNjQsImlzcyI6InVybjpwdXJlY2xvdWQ6d2ViY2hhdCIsIm9yZyI6ImFkYjNlM2VlLTdiYjQtNGUyYS1iNzU0LTE3OGZmOGZjMzU5YiJ9.HsDinpC63xy_WeLvC8wG_AuLXorCweRGwIyo7SVxWfIEEkjeG5tjd1jS0c9MDtBrXiZMMSFBhZ7yLzpsBDfQHmWJv8Th5FN66glH8z0UTp0f1D8ltWsLlnnqe5gkWJi9Vh6yMB-D4BxnVDWUpqZL0sA784U2VqQoe7XEaOHD9MrbUygp-91PF5tD5EiB_ckUaHnf0xsxxa0SA6yVT_3JkFCV4uaSCi6accwjhIigOsOfYvA1iGyYPcGjeaY35_joHQRxVj5eVdV8fRronxa3XjhjC1T-2WlnraUk0pOPS3Z6Lf_P9b1XHvIFLmf2EtsKQN2X-_MZp9fA00Hhd5X-yg"

    activeChats.push({
      name,
      conversationID,
      jwt,
      memberId,
      eventStreamUri,
    });
    Websocket(eventStreamUri);
    sendMessage(conversationID, jwt, memberId, message);

    console.log(activeChats);

    firstChat = false;
  } else if (message != undefined && name != undefined && firstChat == false) {
    sendMessage(
      activeChats[0].conversationID,
      activeChats[0].jwt,
      activeChats[0].memberId,
      message
    );
    // sendMessage(
    //   activeChats[0].ConversationID,
    //   activeChats[0].jwt,
    //   activeChats[0].memberId,
    //   message
    // );
    console.log("Second  message");
  }
  console.log("Valor: " + firstChat);
  return response.status(200).json({ message: "Message received!" });
});

function createConversationObj(name) {
  console.log("Creating conversation object");

  const platformClient = require("purecloud-platform-client-v2");

  const client = platformClient.ApiClient.instance;
  client.setEnvironment(platformClient.PureCloudRegionHosts.us_east_1); // Genesys Cloud region

  let apiInstance = new platformClient.WebChatApi();

  let params = {
    organizationId: "adb3e3ee-7bb4-4e2a-b754-178ff8fc359b",
    deploymentId: "be34dee8-c823-487b-98fe-2afa1f08de35",
    routingTarget: {
      targetType: "queue",
      targetAddress: "TESTE",
    },
    memberInfo: {
      displayName: name,
      avatarImageUrl: "http://some-url.com/JoeDirtsFace",
      lastName: "Joe",
      firstName: "Dirt",
      email: "joe.dirt@example.com",
      phoneNumber: "+12223334444",
      customFields: {
        some_field: "arbitrary data",
        another_field: "more arbitrary data",
      },
    },
  }; // Object | CreateConversationRequest

  // Create an ACD chat conversation from an external
  return apiInstance
    .postWebchatGuestConversations(params)
    .then((data) => {
      return data;
    })
    .catch((err) => {
      console.log("There was a failure calling postWebchatGuestConversations");
      console.error(err);
    });
}

function sendMessage(conversationID, jwt, memberId, message) {
  console.log("Creating message");
  let messageBody;
  console.log(
    "conversationID: " +
      conversationID +
      "\n" +
      "jwt: " +
      jwt +
      "\n" +
      "memberId: " +
      memberId +
      "\n"
  );
  if (firstChat == true) {
    messageBody = {
      body: message,
      bodyType: "standard | notice",
    };
  } else if (firstChat == false) {
    messageBody = {
      body: message,
      bodyType: "standard",
    };
  }
  console.log(
    `https://api.mypurecloud.com/api/v2/webchat/guest/conversations/${conversationID}/members/${memberId}/messages`
  );
  console.log(messageBody);

  fetch(
    `https://api.mypurecloud.com/api/v2/webchat/guest/conversations/${conversationID}/members/${memberId}/messages`,
    {
      method: "POST",
      headers: new Headers({
        Authorization: `Bearer ${jwt}`,
        "Content-Type": "application/json",
      }),
      body: JSON.stringify(messageBody),
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
      console.log(jsonResponse);
      // Start the first function
    })
    .catch((e) => console.error(e));
}

// Websocket()
async function Websocket(eventStreamUri) {
  let clients = [new WebSocket(eventStreamUri)];
  clients.map((client) => {
    client.on("message", (msg) => {
      console.log()
      io.sockets.emit("receive_message", msg.toString());
      console.log(msg.toString())
    });
  });
  
}
// function sendWebSocketMessage(){

//   iosocket.emit("serverCustomEvent", msg.toString());
// }

const io = new Server(3002, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

io.sockets.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: `);
  });

  // socket.on("send_message", (data) => {
  //   socket.to(data.room).emit("receive_message", data);
  // });
//  io.sockets.emit('super event', data);
  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

app.listen(4000, () => {
  console.log("server is Running on 4000");
});