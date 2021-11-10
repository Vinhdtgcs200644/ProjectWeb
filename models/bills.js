const mongoose = require("mongoose");

const BillSchema = new mongoose.Schema({
     title : {
          type: String,
          required:true
     },
     price : {
          type: String,
          required:true
     },
     buyer : {
          type: String,
          required:true
     },
     date :{
          type: String,
          required:true
     }
});

const Bill = mongoose.model("Bill", BillSchema);
module.exports = Bill;
