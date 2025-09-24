const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { signUpData } = require("../utils/validation");
const User = require("../models/user");

const authRouter = express.Router();

authRouter.post("/register", async (req, res) => {
  try {
    const validatedData = signUpData(req);

    const passwordHash = await bcrypt.hash(validatedData.password, 10);
    validatedData.password = passwordHash;

    const user = new User(validatedData);
    await user.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const passwordCheck = await user.verifyPwd(password);

    if (!passwordCheck) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const token = await user.getJwtToken();

    res.cookie("token", token, {
      httpOnly: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
    });
    return res.status(200).json({ message: "Login successful", user });
  } catch (err) {
    return res.status(500).json({ message: "Something went wrong" });
  }
});

authRouter.post("/logout", (req, res) => {
  try {
    const { token } = req.cookies;
    if (!token) {
      throw new Error("User already logged out");
    }
    res.cookie("token", null, { expires: new Date(Date.now()) });
    return res.json({ message: "User logout successfully" });
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
});

module.exports = authRouter;
