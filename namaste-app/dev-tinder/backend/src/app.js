const express = require("express");

const app = express();

app.use("/test", (req, res) => {
  res.send("This is the test path");
});

app.use("/user", (req, res) => {
  res.send("This is the user path");
});

app.use("/", (req, res) => {
  res.send("This is the root '/' path");
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
