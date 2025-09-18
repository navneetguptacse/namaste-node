const mongoosee = require("mongoose");

const connectDB = async () => {
  await mongoosee.connect(
    "mongodb+srv://namastenode:ROnSHHoSfk9rhmyM@namastenode.w7dkkxf.mongodb.net/devtinder"
  );
};

module.exports = connectDB;
