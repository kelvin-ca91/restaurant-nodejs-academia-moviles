const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const order = new Schema({
  client_id: { type: String, required: true },
  dishes: [
    {
      dish_id: { type: String, required: true },
      cant: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  cant_dishes: { type: Number, required: true },
  price_total: { type: Number, required: true },
  date: { type: Date, default: new Date() },
  active: { type: Boolean, default: true },
});

module.exports = mongoose.model("order", order);
