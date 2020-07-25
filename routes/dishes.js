const express = require("express");
const router = express.Router();

const dishesControllers = require("../controllers/dishes");

router.post("/", async (req, res) => {
  try {
    const { body } = req;
    const { _id, avatar } = await dishesControllers.create(body);
    return res.json({
      _id,
      avatar,
      ...body,
    });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await dishesControllers.list();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await dishesControllers.destroy(_id);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/:_id/show", async (req, res) => {
  try {
    const { _id } = req.params;
    console.log(_id);
    const dish = await dishesControllers.show(_id);
    return res.json(dish);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/", async (req, res) => {
  try {
    await dishesControllers.update(req.body);
    return res.json({ ok: true });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error });
  }
});

module.exports = router;
