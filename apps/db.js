var db = require("mongoose");

var password="jaNJvcq5L9X6RNU4";
var username="admin";

// MongoDB link
// mongodb+srv://admin:okMClQERuO8yRrKg@clouddb.234l0.mongodb.net/test

console.log("Connecting to database...");
db.connect("mongodb+srv://admin:"+password+"@clouddata.234l0.mongodb.net/ToyData?retryWrites=true&w=majority", {
     useNewUrlParser: true,
    useUnifiedTopology: true
}).then(()=>{
     console.log("Successfully connected to mongodb");
}).catch(err=>{
     console.log("Error found, cannot connect database" + err);
});
console.log("[+]: DONE");
