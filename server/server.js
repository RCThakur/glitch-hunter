const express= require("express");
const dotenv = require('dotenv');
const connectDB = require('./src/config/config');
const router = require("./src/Routes/AuthRoutes");
const authMiddleware = require("./src/utils/token");
const DifficultyRouter = require("./src/Routes/DifficultyRoutes");
const LevelRouter = require("./src/Routes/LevelRoutes");
const UserRouter = require("./src/Routes/UserRoute");

dotenv.config();

const app= express();

app.use(express.json());



app.use("/api/auth", router);
app.use("/api/user",UserRouter);
app.use("/api/difficulty", DifficultyRouter);
app.use("/api/level", LevelRouter);

const PORT = process.env.PORT || 4001;

app.get("/home",(req,res)=>{
  res.json({msg:"this is home page"});
})

app.get("/protect",authMiddleware,(req,res)=>{
  res.json({msg:" User is authorized good to go "});
})

  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    connectDB();
  });

