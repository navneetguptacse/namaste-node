const { MongoClient } = require("mongodb");
require("dotenv").config();

const DB_NAME = "test_db";
const COLLECTION = "test_collection";
const URL = process.env.MONGO_URI;

const client = new MongoClient(URL);

async function main() {
  await client.connect(); // Optional

  console.log("MongoDB Connected..");

  const database = client.db(DB_NAME);
  const collection = database.collection(COLLECTION);

  // Read Documents
  const documents = await collection.find({}).toArray();
  console.log("Documents: ", documents);

  // Write Document
  const data = {
    name: "Kunal Kumar Arya",
    age: 22,
    gender: "female",
    address: "Patna(Bihar), India",
  };

  const added = await collection.insertMany([data]);
  console.log("Added Document: ", added);

  // Get Count of Documents
  const count = await collection.countDocuments({});
  console.log("Count of Documents: ", count);

  // Find Specific Document
  // const specificDocument = await collection.findOne({ name: "Kunal Kumar Arya" });
  // console.log("Specific Document: ", specificDocument);

  // Or,
  const specificDocument = await collection.find({ name: "Kunal Kumar Arya" }).toArray();
  console.log("Specific Document: ", specificDocument);

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());
