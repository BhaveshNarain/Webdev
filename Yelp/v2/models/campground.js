var mongoose = require("mongoose");

//Schema setup
var campgroundSchema = new mongoose.Schema({
    name: String,
    image: String
});

module.exports = mongoose.model("Campground", campgroundSchema);