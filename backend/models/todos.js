const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema(
  {
    todo: {
      type: String,
      require: true,
    },
    userId: {
       type : mongoose.Schema.Types.ObjectId,
       ref : 'User',
       require : true
    }
  },
  {
    timestamps: true,
  }
);

const todoModel = mongoose.model("todoModel", todoSchema);

module.exports = todoModel;
