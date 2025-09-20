const express = require("express");
const { authUser } = require("../middleware/user");

const userRouter = express.Router();

userRouter.get("/connections", authUser, (req, res) => {
  res.send("connections");
});

userRouter.get("/requests", authUser, (req, res) => {
  res.send("requests");
});

userRouter.get("/feed", authUser, (req, res) => {
  res.send("feeds");
});

module.exports = userRouter;
