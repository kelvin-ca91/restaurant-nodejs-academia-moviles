const express = require("express");
const router = express.Router();

const categoryControllers = require("../controllers/categories");

router.post("/", async (req, res) => {
  try {
    const { body } = req;
    const { _id } = await categoryControllers.create(body);
    return res.json({ _id, ...body });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/", async (req, res) => {
  try {
    const result = await categoryControllers.list();
    return res.json(result);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.get("/:_id/show", async (req, res) => {
  try {
    const { _id } = req.params;
    const category = await categoryControllers.show(_id);
    return res.json(category);
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.delete("/:_id", async (req, res) => {
  try {
    const { _id } = req.params;
    await categoryControllers.destroy(_id);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

router.put("/", async (req, res) => {
  try {
    await categoryControllers.update(req.body);
    return res.json({ ok: true });
  } catch (error) {
    return res.status(500).json({ error });
  }
});

module.exports = router;
