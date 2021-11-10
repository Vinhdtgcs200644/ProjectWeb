var schema = require("../models/bills");

var Bills =[];

function randomize(min, max) {
     return Math.floor(
          Math.random() * (max - min) + min
     )
}

function CartPage(req,res){

     var totalprice = 0;

     for(var item of Bills){
          totalprice += Number(item[1]);
     }

     res.render("cart", {bills:Bills, totalprice:totalprice, status:""});
}

function UpdateCart(req, res){
     if(!req.body){
          console.log("Cannot find body element");
          return res.sendStatus(400);
     }

     if(!req.body.submitbutton){
          Bills.push([
               req.body.title,
               req.body.price
          ]);
          res.redirect("cart");
          return;
     }else{
          var id=randomize(1000,9000);
          var total = req.body.totalprice;

          let ts = Date.now();
          let date_ob = new Date(ts);
          let date = date_ob.getDate();
          let month = date_ob.getMonth() + 1;
          let year = date_ob.getFullYear();


          var addbill = new schema({
               title:"BILL_VOL"+id,
               price:total,
               buyer:"User"+id,
               date:year + "-" + month + "-" + date
          });

          Bills = [];

          addbill.save()
          .then((result)=>{
               console.log("Added bill successfully");
               console.log(result);
               res.render("cart", {bills:Bills, totalprice:0, status:"Successfully purchased"});
               return
          })
          .catch((err)=>{
               console.log("Failed to add bill");
               console.log(err);
               res.send("Something went wrong");
               return;
          });
     }
}

module.exports = {
     _CartPage_ : CartPage,
     _UpdateCart_:UpdateCart
};
