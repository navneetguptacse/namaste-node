const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const connectionRouter = require("./routes/connections");
const userRouter = require("./routes/users");
require("@dotenvx/dotenvx").config();

const app = express();

app.use(express.json());

app.use(cookieParser());

app.use("/auth", authRouter);
app.use("/profile", profileRouter);
app.use("/connections", connectionRouter);
app.use("/users", userRouter);

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
