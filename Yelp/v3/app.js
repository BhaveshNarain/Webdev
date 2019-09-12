var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");

seedDB();

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology:true });

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

// Campground.create({name: "chapman's peak", image: "https://www.w3schools.com/css/img_lights.jpg"},
// function(err, camp){
//     if (err){
//         console.log(err);
//     }else {
//         console.log("Campground is created");
//         console.log(camp);
//     }
// });

// var campgrounds = [
//     {name: "salmon creek", image: "https://www.w3schools.com/css/img_5terre.jpg"},
//     {name: "truworths site", image: "https://www.w3schools.com/css/img_forest.jpg"},
//     {name: "chapman's peak", image: "https://www.w3schools.com/css/img_lights.jpg"}
// ];

app.get("/", function(req, res){
    res.render("landing");
});

app.get("/campgrounds", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds", {campgrounds: allCampgrounds});
        }
    });
});

app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var newCampGround = {name: name, image: image}; 

    Campground.create(newCampGround, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.listen(3000, function(){
    console.log("Server started");
});