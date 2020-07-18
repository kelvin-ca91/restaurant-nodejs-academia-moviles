const express = require("express");
const router = express.Router();
const auth = require("http-auth");
const authController = require("../controllers/auth");

const basic = auth.basic(
  {
    realm: "AM",
  },
  async (username, password, callback) => {
    try {
      const user = await authController.login(username, password);
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
    const token = await authController.afterLogin(email);
    return res.json(token);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
