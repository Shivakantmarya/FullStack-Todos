const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");

const app = express();
app.use(cors());
app.use(express.json());

require("dotenv").config();

const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
.then(()=> {console.log("mongo is connected!")})
.catch((e)=> {console.log("mongo not connectec", e)})


//Signup Login Routes
const userRouter = require("./routes/user-routes");
app.use("/api/user-routes", userRouter);


//Todos Routes
const todoRoute = require("./routes/todo");
app.use("/api/todo", todoRoute);

app.listen(PORT, (req, res) =>{
     console.log(`App is running on PORT ${PORT}`);
})