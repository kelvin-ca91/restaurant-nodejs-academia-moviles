const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const administrators = new Schema({
  nombres: { type: String, required: true },
  apellidos: { type: String, required: true },
  avatar: { type: String, default: "default.jpg" },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, index: true },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("administrators", administrators);
