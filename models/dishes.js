const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dishes = new Schema({
  category_id: { type: String, required: true },
  name: { type: String, required: true },
  avatar: { type: String, default: "default.jpg" },
  price: { type: Number, required: true },
  description: { type: String },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("dishes", dishes);
