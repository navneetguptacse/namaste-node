const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");
const { signUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

const app = express();

app.use(express.json());

app.get("/user", async (req, res) => {
  const email = req.body.email;
  try {
    const user = await User.findOne({ email: email });
    if (user) {
      res.status(400).send("User not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find();
    if (user.length === 0) {
      res.status(400).send("Not found");
    }
    res.send(user);
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

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

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    const passwordCheck = await bcrypt.compare(password, user.password);
    if (!passwordCheck) {
      return res.status(400).send({ message: "Invalid credentials" });
    }

    res.status(200).send({ message: "Login successful", user });
  } catch (err) {
    res.status(500).send({ message: "Something went wrong" });
  }
});

app.patch("/update/:id", async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  const updateList = ["password", "age", "gender", "photo", "skills", "about"];
  try {
    const isUpdateMatched = Object.keys(data).every((k) =>
      updateList.includes(k)
    );

    if (!isUpdateMatched) {
      throw new Error("Invalid update fields provided");
    }

    if (data.password) {
      if (!validator.isStrongPassword(password)) {
        throw new Error(
          "Password must include uppercase, lowercase, number, and special character"
        );
      }
      data.password = await bcrypt.hash(data.password, 10);
    }

    const user = await User.findByIdAndUpdate(id, data, {
      new: true, // return updated document
      // Or,
      // returnDocument: "after",
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    res.status(200).send({
      message: "User updated successfully",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        age: user.age,
        gender: user.gender,
        photo: user.photo,
        about: user.about,
        skills: user.skills,
      },
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
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
