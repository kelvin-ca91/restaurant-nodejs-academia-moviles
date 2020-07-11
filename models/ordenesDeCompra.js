
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const ordenes_de_compras = new Schema({
  cliente_id: { type: String, required: true },
  total: { type: Number, required: true},
  fechaRegistro: { type:Date, default: Date.now() },
  detalle: [{
    plato_id: { type: String, required: true },
    nombre: { type: String, required: true },
    precio: { type: Number, required: true },
    cantidad: { type: Number, required: true }
  }]
});

module.exports = mongoose.model('ordenes_de_compras', ordenes_de_compras);
