const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const dotenv = require("dotenv");

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("Missing MongoDB uri in your environment variables.");
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let db, usersCollection, foodsCollection;

async function connectDB() {
  try {
    await client.connect();
    console.log("Successfully connected to MongoDB!");
    db = client.db("plateShareDB");
    usersCollection = db.collection("users");
    foodsCollection = db.collection("foods");
    return { usersCollection, foodsCollection, ObjectId };
  } catch (error) {
    console.log("MongoDB Connection failed", error);
    process.exit(1);
  }
}

module.exports = { connectDB, ObjectId };
