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

    res.status(201).send({
      message: "User registered successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
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

    res.cookie("token", token, { httpOnly: true });
    res.status(200).send({ message: "Login successful", user });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).send({ message: "Something went wrong" });
  }
});

authRouter.post("/logout", (req, res) => {
  res.send("User logout successfully");
});

module.exports = authRouter;
