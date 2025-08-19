const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  experience : [{ user : {
   difficulty : { type: Number, ref: 'difficulty', required: true },
   level : { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true }
  }}],
  currentDifficulty : { type: Number, ref: 'difficulty', required: true },
  currentLevel : { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true },
  gameIsPaused : {type : Boolean},
  isLoggedIn : { type : Boolean, required : true},
  userLastSession: { 
    difficulty: { type: Number, ref: 'difficulty', required: true },
    level: { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true }
  },
  time : { type: Number},
  leastBulletUsedEver : {type : Number},
  leastBulletUsedLevel : { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true },
  preference : {type: mongoose.Schema.Types.ObjectId, ref: 'Preferences', required: true}
  // experience: [{ type: Number, ref: 'difficulty', required: true }, { type: mongoose.Schema.Types.ObjectId, ref: 'Level', required: true },],
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);