const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const foodsRoute = require("./routes/foods.route");
const { connectDB } = require("./configs/db");
const usersRoute = require("./routes/users.route");
const requestsRoute = require("./routes/requests.route");

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

async function startServer() {
  const collections = await connectDB();

  app.get("/", (_, res) => {
    res.send("Server is up and running!");
  });

  app.use("/foods", foodsRoute(collections));
  app.use("/users", usersRoute(collections));
  app.use("/requests", requestsRoute(collections));

  app.listen(port, () => {
    console.log(`Plate Share Server is running from http://localhost:${port}`);
  });
}

startServer().catch(console.dir);
