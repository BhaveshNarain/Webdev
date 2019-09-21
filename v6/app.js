var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds"),
    Comment     = require("./models/comment"),
    passport    = require("passport"),
    LocalStrategy = require("passport-local"),
    User          = require("./models/user");

//seedDB();

mongoose.connect("mongodb://localhost/yelp_camp", { useNewUrlParser: true, useUnifiedTopology:true,  useCreateIndex: true });

app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");
app.use(express.static(__dirname+ "public"));


//PASSPORT CONFIGS
app.use(require("express-session")({
    secret: "The secrect",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

passport.use(new LocalStrategy(User.authenticate()));

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})



//INDEX
app.get("/", function(req, res){
    res.render("landing");
});


app.get("/campgrounds", function(req, res){
    //get all campgrounds from db
    Campground.find({}, function(err, allCampgrounds){
        if (err){
            console.log(err);
        } else {
            res.render("campgrounds/index", {campgrounds: allCampgrounds, currentUser: req.user});
        }
    });
});

//CREATE
app.post("/campgrounds", function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var newCampGround = {name: name, image: image, description: description}; 

    Campground.create(newCampGround, function(err, newlyCreated){
        if (err){
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});

//NEW
app.get("/campgrounds/new", function(req, res){
    res.render("campgrounds/new");
});

//SHOW
app.get("/campgrounds/:id", function(req, res){
    //find campground with id
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            //render show template
            res.render("campgrounds/show", {campground: foundCampground});            
        }
    });
});

//
//  COMMENTS ROUTES 
//
app.get("/campgrounds/:id/comments/new",isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground: foundCampground});
        }
    });
});

app.post("/campgrounds/:id/comments/", isLoggedIn, function(req, res){
    //lookup campground using id
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //create new comment
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                } else {
                    //connect new comment to campground
                    //redirect campground show page
                    foundCampground.comments.push(comment);
                    foundCampground.save();
                    res.redirect("/campgrounds/"+foundCampground._id);
                }
            });
            
        }
    });

});

//AUTH ROUTES

//show register form
app.get("/register", function(req, res){
    res.render("register");
});

//handle sign up logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err,user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        })
    });
});

//show login form
app.get("/login", function(req, res){
    res.render("login");
});

//handle login
app.post("/login", passport.authenticate("local",
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){ 
});

//show login form
app.get("/logout", function(req, res){
    req.logOut();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen(3000, function(){
    console.log("Server started");
});