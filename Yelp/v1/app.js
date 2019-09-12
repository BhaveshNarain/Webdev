var express = require("express");
var bodyParser = require("body-parser");

var app = express();

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

var campgrounds = [
    {name: "salmon creek", image: "https://www.w3schools.com/css/img_5terre.jpg"},
    {name: "truworths site", image: "https://www.w3schools.com/css/img_forest.jpg"},
    {name: "chapman's peak", image: "https://www.w3schools.com/css/img_lights.jpg"}
];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    res.render("campgrounds", {campgrounds: campgrounds});
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampGround = {name: name, image: image}; 
    campgrounds.push(newCampGround);

    res.redirect("/campgrounds");
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("Server started");
});