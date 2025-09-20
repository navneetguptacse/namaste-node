const express = require("express");
const { authUser } = require("../middleware/user");

const profileRouter = express.Router();

profileRouter.get("/me", authUser, async (req, res) => {
  try {
    res
      .status(200)
      .send({ message: "User profile fetched sucessfully", user: req.user });
  } catch (err) {
    res
      .status(400)
      .send({ message: err.message || "Failed to fetch user profile." });
  }
});

profileRouter.patch("/me", authUser, (req, res) => {
  res.send("User updated sucessfully");
});

profileRouter.patch("/me/password", authUser, (req, res) => {
  res.send("User passowrd updated sucessfully");
});

module.exports = profileRouter;
