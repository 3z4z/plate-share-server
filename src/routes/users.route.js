const express = require("express");

const usersRoute = ({ usersCollection, ObjectId }) => {
  const router = express.Router();

  //   post a user
  router.post("/", async (req, res) => {
    try {
      const newUser = req.body;
      const query = { email: newUser.email };
      const isExistedUser = await usersCollection.findOne(query);
      if (isExistedUser) {
        res.send("Users already exists. Skipped Account Creation");
      } else {
        const result = await usersCollection.insertOne(newUser);
        res.send(result);
      }
    } catch {
      res.status(500).send("Server failed to create new Account");
    }
  });
  return router;
};

module.exports = usersRoute;
