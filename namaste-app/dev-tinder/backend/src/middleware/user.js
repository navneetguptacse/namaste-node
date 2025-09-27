const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authUser = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      throw new Error("Unauthorized access");
    }

    const { _id } = jwt.verify(token, process.env.MY_SECRET_KEY);
    const user = await User.findById(_id);

    if (!user) {
      throw new Error("User not found. Invalid token.");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(401).send({ message: err.message || "Unauthorized access" });
  }
};

module.exports = { authUser };
