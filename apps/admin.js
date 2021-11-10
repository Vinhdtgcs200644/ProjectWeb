const staff = require("../models/staffs");

function AdminPanel(req,res){

     res.render("admin",{
          checkvar:2,
          data:["0","0","0","0","0"]
     });
}

function Update(req, res){

     if(!req.body){
          return res.sendStatus(400);
     }

     if(req.body.category=="0"){

          var fullname = req.body.fullname;
          var age = req.body.age;
          var phone = req.body.phone;
          var addr = req.body.addr;
          var email = req.body.email;

          const addnew = new staff({
               fullname:fullname,
               Age:Number(age),
               phone:phone,
               Address:addr,
               email:email
          });
          addnew.save()
               .then((result)=>{
                    console.log("successfully added");
                    console.log(result);
                    res.render("admin",{
                         checkvar:5,
                         data:["0","0","0","0","0"]
                    });
                    return;
               }).catch((err)=>{
                    console.log("An error happened when adding");

                    res.status(400);
                    res.send("Unexpected error happened");
                    return;
               });

     }else{
          console.log("Got requested");

          if(req.body.fullname==""){
               res.render("admin", {
                    checkvar:2,
                    data:["0","0","0","0","0"]
               });
               return;
          }

          if(req.body.prove_=="Check"){
               staff.find({fullname:req.body.fullnameN}, (error, data)=>{
                    if(error){
                         console.log("Error");
                         console.log(error);
                         res.send("Error");
                         return;
                    }else{
                         if(data.length==0){
                              res.render("admin", {
                                   checkvar:3,
                                   data:["0","0","0","0","0"]
                              });
                              return;
                         }
                         var array = [];

                         array.push(data[0].fullname);
                         array.push(data[0].phone);
                         array.push(data[0].Age);
                         array.push(data[0].Address);
                         array.push(data[0].email);

                         console.log("Found query result");

                         res.render("admin", {
                              checkvar:4,
                              data:array
                         });
                    }
               });
          }else if(req.body.prove_=="Delete"){

               var fullname_ = req.body.fullnameN;

               staff.findOneAndRemove({fullname:fullname_}, function(err){
                    if(err){
                         console.log("Error found");
                         console.log(err);
                         return res.status(500).send();
                    }else{
                         console.log("Successfully deleted");
                         res.render("admin",{
                              checkvar:6,
                              data:["0","0","0","0","0"]
                         });
                         return
                    }
               });

          }else{
               var fullname_ = req.body.fullnameN;
               var age_ = req.body.ageN;
               var phone_ = req.body.phoneN;
               var addr_ = req.body.addressN;
               var email_ = req.body.emailN;

               console.log(fullname_);
               console.log(age_);
               console.log(phone_);
               console.log(addr_);
               console.log(email_);

               staff.findOneAndUpdate({fullname:fullname_},{
                    fullname:fullname_,
                    Age:Number(age_),
                    phone:phone_,
                    Address:addr_,
                    email:email_
               }).then((result)=>{
                    console.log("successfully updated");
                    console.log(result);
                    res.render("admin",{
                         checkvar:7,
                         data:["0","0","0","0","0"]
                    });
                    return;
               }).catch((err)=>{
                    console.log("An error happened when adding");
                    console.log(err);
                    res.status(400);
                    res.send("Unexpected error happened");
                    return;
               });

          }

     }
}

function StaffPage(req, res){

     staff.find((error, data)=>{
          if(error){
               console.log("Error detected");
               console.log(error);
               res.send("Something went wrong");
               return
          }
          console.log(data);

          res.render("staff", {data:data});
     });
}

module.exports = {
     _AdminP_ : AdminPanel,
     _UpdateAd_ : Update,
     _StaffPage_:StaffPage
};
