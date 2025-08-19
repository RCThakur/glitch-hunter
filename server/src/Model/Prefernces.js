const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  volume: { type: Number, default: 50 },
  sfx: { type: Boolean, default: true },
  difficulty: { type: String, default: 'medium' },
}, { timestamps: true });

module.exports = mongoose.model('Preferences', preferencesSchema);
