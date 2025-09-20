const express = require("express");
const { authUser } = require("../middleware/user");

const connectionRouter = express.Router();

connectionRouter.post("/send/:id", authUser, (req, res) => {
  // like | ignore
  res.send("Sent request status");
});

connectionRouter.post("/review/:id", authUser, (req, res) => {
  // accept | reject
  res.send("Reviewed request status");
});

module.exports = connectionRouter;
