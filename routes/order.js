const express = require("express");
const router = express.Router();

const ordersControllers = require("../controllers/orders");

router.post("/", async (req, res) => {
  try {
    const { body } = req;
    const order = await ordersControllers.create(body);
    return res.json(order);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await ordersControllers.list();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
