const schema = require("../models/products");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
var pendingname="";
// function StringID(length) {
//      var result           = '';
//      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
//      var charactersLength = characters.length;
//      for ( var i = 0; i < length; i++ ) {
//           result += characters.charAt(Math.floor(Math.random() *
//           charactersLength));
//      }
//      return result;
// }


const fileStorageEngine = multer.diskStorage({
     destination:(req,file,cb)=>{

          fs.readdir("./trash", (err, files_) => {
               files_.forEach(item => {
                    if(item!="here"){
                         fs.unlink("./trash"+"/"+item, function (err) {
                              if (err) throw err;
                         });
                    }
               });
               console.log("Trash cleared successfully.");
          });

          if(
               req.body.title=="" ||
               req.body.price=="" ||
               req.body.origin=="None"
          ){
               console.log("Nothing is performed");
               cb(null,"./trash");
          }else{
               cb(null,"./public/img");
          }
     },
     filename:(req,file,cb)=>{
          var filename = file.originalname;
          cb(null, filename);
     }
});

const upload = multer({storage:fileStorageEngine});

function ProductPage(req,res){

     schema.find((err, data)=>{

          var printdata = [[]];
          var count=0;
          var index=0;

          if(err){
               console.log("Error");
               console.log(err);
               res.send("Error");
               return;
          }

          for(var i in data){
               printdata[index].push([
                    data[i].title,
                    data[i].price,
                    data[i].description,
                    data[i].imglink
               ]);

               count+=1;
               if(count==4){
                    printdata.push([]);
                    count=0;
                    index+=1;
               }
          }

          res.render("product",{data:printdata});
     });

}

function ProductManagePage(req, res){
     res.render("prodview", {
               checkvar:1,
               data:["0","0","0","0"]
          }
     );
}


function AddProduct(req, res){
     if(!req.body){
          return res.sendStatus(400);
     }

     var title = req.body.title;
     var price = req.body.price;
     var origin = req.body.origin;
     var descript = req.body.description;
     if(descript==""){
          descript="None";
     }
     if(title=="" ||price=="" ||origin=="None"||req.file==undefined){
          res.render("prodview",{
               checkvar:6,
               data:["0","0","0","0"]
          });
          return;
     }

     var newfile = Date.now()+"--"+req.file.originalname;

     fs.rename("./public/img/"+req.file.originalname,"./public/img/"+newfile,
          (err)=>{
               if(err){
                    console.log("Error");
                    console.log(err);
                    res.send("Unexpected error happens.");
                    return;
               }
          }
     );

     console.log("Done adding data");

     var prodnew = new schema({
          title:title,
          price:price,
          origin:origin,
          description:descript,
          imglink:newfile
     });
     prodnew.save()
          .then((result)=>{
               console.log("Successfully added");
               console.log(result);
               res.render("prodview",{
                    checkvar:5,
                    data:["0","0","0","0"]
               });
               return;
          }).catch((err)=>{
               console.log("Error");
               console.log(err);
               res.send("Unexpected error happens");
               return;
          });
     return;
}

function UpdateProd(req, res){


     if(!req.body){
          return res.sendStatus(400);
     }
     if(req.body.title==""){
          res.render("prodview", {
               checkvar:2,
               data:["0","0","0","0"]
          });
          return;
     }
     if(req.body.buttonupload=="Check"){
          schema.find({title:req.body.title_2}, (error, data)=>{
               if(error){
                    console.log(error);
                    console.log("Error detected");
               }else{
                    if(data.length==0){
                         res.render("prodview", {
                              checkvar:3,
                              data:["0","0","0","0"]
                         });
                         return;
                    }
                    var array = [];
                    pendingname = req.body.title_2;
                    array.push(data[0].title);
                    array.push(data[0].price);
                    array.push(data[0].origin);
                    array.push(data[0].description);

                    console.log("Found query result");

                    res.render("prodview", {
                         checkvar:4,
                         data:array
                    });
               }
          });
     }else if(req.body.buttonupload=="Update"){

          var title=req.body.title_2;
          var price=req.body.price_2;
          var descript=req.body.description_2;
          var origin=req.body.origin_2;
          console.log(pendingname);
          schema.findOneAndUpdate({title:pendingname},{
               title:title,
               price:price,
               origin:origin,
               description:descript
          }).then((result)=>{
               console.log("successfully updated product");
               console.log(result);
               res.render("prodview",{
                    checkvar:7,
                    data:["0","0","0","0"]
               });
               return;
          }).catch((err)=>{
               console.log("An error happened when updating");
               console.log(err);
               res.status(400);
               res.send("Unexpected error happened");
               return;
          });

          return;
     }else if(req.body.buttonupload=="Delete"){
          schema.findOneAndRemove({title:pendingname}, (err)=>{
               if(err){
                    console.log("Error found");
                    console.log(err);
                    return res.status(500).send();
               }else{
                    console.log("Successfully deleted");
                    res.render("prodview",{
                         checkvar:8,
                         data:["0","0","0","0"]
                    });
                    return
               }
          });
     }else if(req.body.buttonupload=="Show"){
          schema.find()
          .then((result)=>{
               res.render("prodview",{
                    checkvar:9,
                    data:["0","0","0","0"],
                    result:result
               });
               return;
          }).catch((err)=>{
               console.log("Error found");
               console.log(err);
               return res.status(500).send();
          })
     }
}

function Search(req, res){
     res.render("search",{result:[]});
}

function SearchProcess(req,res){

     if(!req.body || req.body.search==""){
          res.redirect("search");
          return;
     }

     schema.find({title:req.body.search}, (error, data)=>{
          if(error){
               res.send("something went wrong");
               console.log(error);
               return;
          }

          if(data.length==0){
               res.render("search",{
                    result:[null]
               });
               return;
          }
          res.render("search", {
               result:[
                    data[0].title,
                    data[0].price,
                    data[0].origin,
                    data[0].description,
                    data[0].imglink
               ]
          });
     });
}

module.exports = {
     _ProdManage_ : ProductManagePage,
     _ProdList_ : ProductPage,
     _Product_Update : UpdateProd,
     _AddProduct_ : AddProduct,
     _SearchProd_ : Search,
     _SearchAnalyze_ : SearchProcess,
     upload:upload
};
