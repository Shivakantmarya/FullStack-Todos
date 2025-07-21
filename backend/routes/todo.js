const express = require("express");
const todoModel = require("../models/todos");
const authUser = require("../middleware/auth");

const todoRouter = express.Router();

//all todos routes
todoRouter.get("/all", authUser, async (req, res) =>{
     //  const {userId} = req.params;
      try{
           const allTodos = await todoModel.find({userId: req.userId}).sort({createdAt : -1});
           res.json({message : "Fetched all Todos", allTodos});
      }
      catch(err){
           console.error("Error found", err);
           return res.json({message: "Erro found"});
      }
})

//create todos routes
todoRouter.post("/create", authUser,  async (req, res) =>{
      const todoData = req.body;
      try{
           const newTodo = await todoModel.create({
               ...todoData,
               userId: req.userId
           });

           res.json({
            message : "Yout todo is Save!",
            data : newTodo
           });
      }
      catch(e){
           return res.json({message : "Internal Error"});
      }
});

//Edit & Update todos routes

todoRouter.put("/update/:id", authUser,  async (req, res) =>{
     const id = req.params.id;
     const data = req.body;

     try{
          const updateData = await todoModel.findByIdAndUpdate(
             id,
             data,
             {new : true}
          );
          if(!updateData) return res.json({message: "Todo not found!"});

          if (updateData.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

          res.json({message: "Todo updated Successfully!", todo: updateData});
     }
     catch(e){
         console.error(e);
         return res.json({message: "Internal Error"});
     }
})

//Delete todos routes

todoRouter.delete("/delete/:id", authUser,  async (req, res) =>{
     const id = req.params.id;
     // console.log("deleted id : ", id);
     try{
           const deleteData = await todoModel.findByIdAndDelete(id);
          //  console.log("deleted Data : ", deleteData);
           if(!deleteData) return res.json("Todo not found!");

           if (deleteData.userId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized" });
        }

           res.json({
              message : "Todo deleted Successfully!",
              data : deleteData
           })
     }
     catch(e){
         console.error(e);
         return res.json({message: "Internal server error!"});
     }
});


module.exports = todoRouter;