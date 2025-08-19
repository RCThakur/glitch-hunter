const mongoose = require('mongoose');

const preferencesSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User'
  },
  volume: { 
    type: Number, 
    default: 50,
    min: [0, 'Volume cannot be less than 0'],
    max: [100, 'Volume cannot be more than 100'],
    validate: {
      validator: Number.isInteger,
      message: 'Volume must be an integer'
    }
  },
  sfx: { 
    type: Boolean, 
    default: true,
    validate: {
      validator: v => typeof v === 'boolean',
      message: 'SFX must be a boolean value'
    }
  }
}, { timestamps: true });


module.exports = mongoose.model('Preferences', preferencesSchema);
