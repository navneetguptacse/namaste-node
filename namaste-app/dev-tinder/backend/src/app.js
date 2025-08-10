const express = require("express");
const connectDB = require("./config/database");
const User = require("./models/user");

const app = express();

app.post("/signup", async (req, res) => {
  const userObj = {
    firstName: "Kunal",
    lastName: "Kumar",
    email: "kunal@gmail.com",
    password: "kunal@123",
    age: 23,
    gender: "male",
  };

  try {
    const user = new User(userObj);
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(err.status).send("Somthing went wrong");
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
