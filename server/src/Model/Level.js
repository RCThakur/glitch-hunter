const mongoose = require('mongoose');

const levelSchema = new mongoose.Schema({
  name : {type : Number, required : true },
  bots : {type: Number, required : true},
  bullets : {type: Number, required : true},
  difficulty:{type:Number, ref:"difficulty" ,required:true},
  defaultTime : {type : Number, required : true}
}, { timestamps: true });

const LevelModel = mongoose.model('Level', levelSchema);

module.exports = LevelModel;
