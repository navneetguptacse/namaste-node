const mongoosee = require("mongoose");

const connectDB = async () => {
  await mongoosee.connect(process.env.MONGO_URI);
};

module.exports = connectDB;
