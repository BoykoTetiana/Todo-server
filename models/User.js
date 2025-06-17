const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName:  { type: String, required: true },
  birthDate: { type: Date, required: true },
  email:     { type: String, required: true, unique: true },
  password:  { type: String, required: true }, // Зберігатимемо хеш
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
