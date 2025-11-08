const express = require("express");

const foodsRoute = ({ foodsCollection, ObjectId }) => {
  const router = express.Router();

  // get all foods
  router.get("/", async (req, res) => {
    try {
      const { email } = req.query;
      const query = {};
      if (email) {
        query.email = email;
      }
      const cursor = foodsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    } catch {
      res.status(500).send({ message: "Server Failed while fetching foods" });
    }
  });

  // add a food
  router.post("/", async (req, res) => {
    try {
      const newFood = {
        ...req.body,
        created_at: new Date(),
      };
      const query = { name: newFood.name };
      const isExistedFood = await foodsCollection.findOne(query);
      if (isExistedFood) {
        res.send(`Duplicate food can't be added`);
      } else {
        const result = await foodsCollection.insertOne(newFood);
        res.send(result);
      }
    } catch {
      res.status(500).send("Failed to add new food.");
    }
  });

  return router;
};

module.exports = foodsRoute;
