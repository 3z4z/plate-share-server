const express = require("express");
const { verifyAuthToken } = require("../middlewares/auth");

const requestsRoute = ({ requestsCollection, foodsCollection, ObjectId }) => {
  const router = express.Router();

  router.get("/", verifyAuthToken, async (req, res) => {
    try {
      const { email, foodId } = req.query;
      const query = {};
      if (email) query.requesterEmail = email;
      if (foodId) query.foodId = foodId;

      if (foodId) {
        const food = await foodsCollection.findOne({
          _id: new ObjectId(foodId),
        });
        if (food && food.donor_email === req.auth_email) {
          const result = await requestsCollection.find(query).toArray();
          return res.send(result);
        } else if (email) {
        }
      }
      const result = await requestsCollection
        .find({ requesterEmail: req.auth_email })
        .toArray();

      res.send(result);
    } catch (err) {
      console.error("Error fetching requests:", err);
      res.status(500).send("Server Failed fetching the requests");
    }
  });

  router.post("/", verifyAuthToken, async (req, res) => {
    try {
      const newRequest = req.body;
      const query = {
        foodId: newRequest.foodId,
        requesterEmail: newRequest.requesterEmail,
      };
      const isExistedRequest = await requestsCollection.findOne(query);
      if (isExistedRequest) {
        res.status(409).send("Already Requested!");
      } else {
        const result = await requestsCollection.insertOne(newRequest);
        res.send(result);
      }
    } catch {
      res.status(500).send("Failed to send a request.");
    }
  });

  router.patch("/:requestId", verifyAuthToken, async (req, res) => {
    const session = requestsCollection.client.startSession();
    try {
      const requestId = req.params.requestId;
      const updatedDoc = req.body;

      const request = await requestsCollection.findOne({
        _id: new ObjectId(requestId),
      });
      //   if (!request) return res.status(404).send("Request not found.");

      const food = await foodsCollection.findOne({
        _id: new ObjectId(request.foodId),
      });
      //   if (!food) return res.status(404).send("Food not found.");

      if (food.donor_email !== req.auth_email)
        return res.status(403).send("Access Forbidden.");

      const requestQuery = { _id: new ObjectId(requestId) };
      const requestStatusUpdate = {
        $set: { requestStatus: updatedDoc.requestStatus },
      };
      await session.withTransaction(async () => {
        await requestsCollection.updateOne(requestQuery, requestStatusUpdate, {
          session,
        });

        let food_status = "Available";
        if (updatedDoc.requestStatus.toLowerCase() === "accepted") {
          food_status = "Donated";
        } else if (updatedDoc.requestStatus.toLowerCase() === "rejected") {
          food_status = "Available";
        } else if (updatedDoc.requestStatus.toLowerCase() === "pending") {
          food_status = "Available";
        } else {
          res.status(404).send("Invalid Action keyword.");
        }
        const foodQuery = { _id: new ObjectId(request.foodId) };
        const foodStatusUpdate = { $set: { food_status } };
        await foodsCollection.updateOne(foodQuery, foodStatusUpdate, {
          session,
        });

        if (updatedDoc.requestStatus.toLowerCase() === "accepted") {
          const requestsQuery = {
            foodId: request.foodId,
            _id: { $ne: new ObjectId(requestId) },
          };
          const requestsUpdate = { $set: { requestStatus: "Rejected" } };
          await requestsCollection.updateMany(requestsQuery, requestsUpdate, {
            session,
          });
        }
      });

      res.send("Request and food status updated successfully.");
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error.");
    } finally {
      await session.endSession();
    }
  });
  router.delete("/:id", async (req, res) => {
    try {
      const query = { _id: new ObjectId(req.params.id) };
      const result = await requestsCollection.deleteOne(query);
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

module.exports = requestsRoute;
