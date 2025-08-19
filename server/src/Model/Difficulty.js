const mongoose = require("mongoose");

const difficultySchema = new mongoose.Schema({
    _id:{type:Number, required : true},
    name: { type: String, enum: ['easy', 'medium',  'hard'] }

})

const Diffmodel = mongoose.model("difficulty", difficultySchema)

module.exports = Diffmodel;