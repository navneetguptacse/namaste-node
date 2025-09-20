const express = require("express");
const { authUser } = require("../middleware/user");
const User = require("../models/user");
const { safeUpdate } = require("../utils/validation");

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

profileRouter.patch("/me", authUser, async (req, res) => {
  try {
    safeUpdate(req);
    /**
     * const user = req.user;
     *
     * if (!user) {
     *   throw new Error("User not found");
     * }
     *
     * Object.keys(req.body).forEach(key => user[key] = req.body[key]);
     *
     * await user.save();
     *
     * Or, */

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error("User not found");
    }

    res.send({ message: "User updated sucessfully", user });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

profileRouter.patch("/me/password", authUser, (req, res) => {
  res.send("User passowrd updated sucessfully");
});

module.exports = profileRouter;
