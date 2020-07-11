const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const categories = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("categories", categories);
