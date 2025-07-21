const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const router = express.Router();
const jwt = require("jsonwebtoken");

const userModel = require('../models/user-model')

// Signup Routers 

router.post('/register', async (req, res) =>{
     const {name, email, password} = req.body;
     try{
           const isUser = await userModel.findOne({email});
           if(isUser) return res.json("User already exist!");

           const hashedPass = await bcrypt.hash(password, 10);

           const newUser = await userModel.create({name, email, password : hashedPass});
           res.json("User registered successfully!",newUser);
          //  newUser.save();
     }
     catch(e){
          return res.json({message : "Internal Error!", error : e.message});
     }
});


// Login Routers 

router.post("/login", async (req, res) =>{
      const {email, password} = req.body;
      try{
          //check if user exist
           const isUser = await userModel.findOne({email});
           if(!isUser) return res.json({message : "User not found!"});
           
           //Verify password
           const isPass = await bcrypt.compare(password , isUser.password);
           if(!isPass) return res.json({message : "Invalid password!"});

           //Create Token
           const token = jwt.sign(
               {
                    userId : isUser._id,
                    userEmail : isUser.email
               },
               process.env.JWT_SECRET,
               {
                    expiresIn : "1h"
               }
          );
        
          console.log("user logged in : ", {
                    Id : isUser._id,
                    Name : isUser.name,
                    Pass : isUser.password
          });

           res.json({
               message : "Login Successfull!",
               token,
               user : {
                    userId : isUser._id,
                    userName : isUser.name,
                    userPass : isUser.password
               }
          });
      }
      catch(e){
          return res.json({message : "Internal error "});
      }
})


module.exports = router;
