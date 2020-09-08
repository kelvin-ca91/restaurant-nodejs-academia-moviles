const express = require("express");
const router = express.Router();
const auth = require("http-auth");
const clientsController = require("../controllers/clients");

const basic = auth.basic(
  {
    realm: "AM",
  },
  async (username, password, callback) => {
    try {
      const user = await clientsController.login(username, password);
      if (user) {
        return callback(user);
      }
      return callback(false);
    } catch (error) {
      return callback(false);
    }
  }
);

router.post("/", auth.connect(basic), async (req, res) => {
  try {
    const email = req.user;
    const token = await clientsController.afterLogin(email);
    return res.json(token);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
