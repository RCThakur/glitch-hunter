
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); 

const connectTODB= async()=>{

    try {
       await mongoose.connect(process.env.MONGODB_URL, {
          useNewUrlParser: true,
         useUnifiedTopology: true,
});
        console.log("Mongo db connected ");

    } catch (error) {
        console.log("error",error);
        process.exit(1);
    }
}
module.exports= connectTODB;