const mongoose = require("mongoose");

const ProdSchema = new mongoose.Schema({
     title : {
          type: String,
          required:true
     },
     price : {
          type: String,
          required:true
     },
     origin : {
          type: String,
          required:true
     },
     description : {
          type: String,
          required:false
     },
     imglink : {
          type:String,
          required:true
     }
});

const Product = mongoose.model("Products", ProdSchema);
module.exports = Product;
