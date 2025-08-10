const mongoosee = require("mongoose");

// mongoosee.connect(
//   "mongodb+srv://namastenode:ROnSHHoSfk9rhmyM@namastenode.w7dkkxf.mongodb.net/"
// );

const connectDB = async () => {
  await mongoosee.connect(
    "mongodb+srv://namastenode:ROnSHHoSfk9rhmyM@namastenode.w7dkkxf.mongodb.net/devtinder"
  );
};

module.exports = connectDB;

// connectDB()
//   .then(() => console.log("✓ Database connection success."))
//   .catch((err) => {
//     console.log("✗ Database connection failed!!");
//   });
