require("dotenv").config();
const express = require('express');
const app = express();
app.use(express.json());
app.post('/teste', (req, res) => {
  res.json(req.body);
  console.log(req.body)
});

app.use("/users", require("./routes/usersRoutes"))


app.use(function(err, req, res, next) {
  err.message;
  next(err);
});

console.log("server is running at port 3002")
const server = app.listen(3002);


