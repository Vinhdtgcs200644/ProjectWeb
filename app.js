var express = require("express");
var path = require("path");

var app = express();

var routes = require("./routes");


app.set("port", process.env.PORT || 3000); // Adding in port
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
// Telling it to use the EJS template

app.use(express.static('public'));
app.use(routes);

app.listen(app.get("port"), function(){
     console.log("Starting the server...");
     console.log("Address => http://localhost:" + app.get("port") + "/");
})
