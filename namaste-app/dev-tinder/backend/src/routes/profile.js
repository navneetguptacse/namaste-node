const express = require("express");
const { authUser } = require("../middleware/user");
const User = require("../models/user");
const { safeUpdate } = require("../utils/validation");
const validator = require("validator");
const bcrypt = require("bcrypt");

const profileRouter = express.Router();

profileRouter.get("/me", authUser, async (req, res) => {
  try {
    return res.json({
      message: "User profile fetched sucessfully",
      user: req.user,
    });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

profileRouter.patch("/me", authUser, async (req, res) => {
  try {
    safeUpdate(req);

    const user = await User.findByIdAndUpdate(req.user._id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new Error("User not found");
    }

    return res.json({ message: "User updated sucessfully", user });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

profileRouter.patch("/me/password", authUser, async (req, res) => {
  try {
    const { password } = req.body;

    if (!password || !validator.isStrongPassword(password)) {
      return res.status(400).json({
        message: "Please enter a strong password.",
      });
    }

    const user = req.user;

    const isSamePassword = await bcrypt.compare(password, user.password);
    if (isSamePassword) {
      return res.status(400).json({
        message: "Try to update with a new password.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    user.password = passwordHash;
    await user.save();

    // res.cookie("token", null, { expires: new Date(Date.now()) });

    return res.json({ message: "Password updated sucessfully." });
  } catch (err) {
    console.error("Password update error:", err);
    return res.status(500).json({ message: "Internal server error." });
  }
});

module.exports = profileRouter;
