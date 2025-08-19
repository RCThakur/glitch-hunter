const mongoose = require('mongoose');

const guestSchema = new mongoose.Schema({
  guestId: { type: String, required: true, unique: true },
}, { timestamps: true });

module.exports = mongoose.model('Guest', guestSchema);
