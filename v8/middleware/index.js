var Campground = require("../models/campground"),
    Comment = require("../models/comment");

//All middleware
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        //does user own the campground
        console.log("user is correctly authenticated");
        Campground.findById(req.params.id, function (err, foundCampground) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundCampground.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("User not authorized");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("User not logged in");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function (req, res, next) {
    if (req.isAuthenticated()) {
        //does user own the campground
        console.log("user is correctly authenticated");
        Comment.findById(req.params.comment_id, function (err, foundComment) {
            if (err) {
                console.log(err);
                res.redirect("back");
            } else {
                if (foundComment.author.id.equals(req.user._id)) {
                    next();
                } else {
                    console.log("User not authorized");
                    res.redirect("back");
                }
            }
        });
    } else {
        console.log("User not logged in");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}


module.exports = middlewareObj;