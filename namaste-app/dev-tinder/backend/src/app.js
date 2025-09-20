const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { signUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");
const cookieParser = require("cookie-parser");
const { authUser } = require("./middleware/user");

const app = express();

app.use(express.json());

app.use(cookieParser());

app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
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

app.get("/profile", authUser, async (req, res) => {
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

app.post("/send-request", authUser, (req, res) => {
  res.send("Connection request has been sent");
});

connectDB()
  .then(() => {
    console.log("✓ Database connection success.");
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((err) => {
    console.log("✗ Database connection failed!!");
  });
