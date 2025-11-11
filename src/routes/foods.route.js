const express = require("express");
const { verifyAuthToken } = require("../middlewares/auth");

const foodsRoute = ({ foodsCollection, ObjectId }) => {
  const router = express.Router();

  // get all foods
  router.get("/", async (req, res) => {
    try {
      const projectFields = {
        name: 1,
        donor_name: 1,
        quantity: 1,
        image: 1,
        expire_date: 1,
        pickup_location: 1,
        food_status: 1,
      };
      const { email, status } = req.query;
      const query = {};
      if (email) {
        query.donor_email = email;
      }
      if (status) {
        query.food_status = status;
      }
      const cursor = foodsCollection.find(query).project(projectFields);
      const result = await cursor.toArray();
      res.send(result);
    } catch {
      res.status(500).send("Server Failed while fetching foods");
    }
  });

  // get featured foods
  router.get("/featured", async (_, res) => {
    try {
      const projectFields = {
        name: 1,
        donor_name: 1,
        quantity: 1,
        image: 1,
        expire_date: 1,
        pickup_location: 1,
        food_status: 1,
      };
      const query = { food_status: "Available" };
      const cursor = foodsCollection
        .find(query)
        .project(projectFields)
        .sort({ quantity: -1 })
        .limit(6);
      const result = await cursor.toArray();
      res.send(result);
    } catch {
      res.status(500).send("Server Failed while fetching featured foods");
    }
  });

  // get a single food
  router.get("/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await foodsCollection.findOne(query);
      res.send(result);
    } catch {
      res.status(500).send("Server failed when fetching the food.");
    }
  });

  // add a food
  router.post("/", verifyAuthToken, async (req, res) => {
    try {
      const newFood = req.body;
      const query = { name: newFood.name };
      const isExistedFood = await foodsCollection.findOne(query);
      if (isExistedFood) {
        res.status(409).send("Duplicate food can't be added");
      } else {
        const result = await foodsCollection.insertOne(newFood);
        res.status(200).send(result);
      }
    } catch {
      res.status(500).send("Failed to add new food.");
    }
  });

  // update a food
  router.patch("/:id", verifyAuthToken, async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const food = await foodsCollection.findOne(query);
      if (food.donor_email !== req.auth_email) {
        return res.status(403).send("Access Forbidden.");
      }
      const updatedDoc = req.body;
      const update = {
        $set: {
          name: updatedDoc.name,
          image: updatedDoc.image,
          quantity: updatedDoc.quantity,
          food_status: updatedDoc.food_status,
          pickup_location: updatedDoc.pickup_location,
          description: updatedDoc.description,
          expire_date: updatedDoc.expire_date,
          edited_at: updatedDoc.edited_at,
        },
      };

      const result = await foodsCollection.updateOne(query, update);
      res.send(result);
    } catch (err) {
      console.error("Update error:", err.message);
      res.status(500).send("Can't update the document. Server Error");
    }
  });

  // delete a food
  router.delete("/:id", verifyAuthToken, async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await foodsCollection.deleteOne(query);
      if (result.deletedCount === 0) {
        return res.status(404).send("Nothing is deleted.");
      }
      res.send(result);
    } catch (error) {
      console.log(error);
      res.status(500).send("Something Went Wrong!");
    }
  });

  return router;
};

module.exports = foodsRoute;
