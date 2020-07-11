const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const usuarios = new Schema({
  nombres: { type: String, required: true },
  apellido_paterno: { type: String, required: true },
  apellido_materno: { type: String, required: true },
  imagen: { type: String, default:'default.jpg' },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true, index: true },
  sockets:{ type:Array, default: []},
  active: { type: Boolean, default: true },
  fechaRegistro: { type: Date, default: new Date() }
});

module.exports = mongoose.model('usuarios', usuarios);