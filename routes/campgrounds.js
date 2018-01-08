var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - Show all camps
router.get('/', function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, camps){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/index", {camps: camps});
        }
    });
});

//NEW - Show form to create new camp
router.get('/new', isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE - Add new camp
router.post('/', isLoggedIn, function(req, res) {

    var campObj = {
        name: req.body.name,
        image: req.body.image,
        description: req.body.description
    }
    Campground.create(campObj, function(err, camp){
        if(err){
            console.log(err);
        }
        else {
            res.redirect("/campgrounds");
        }
    });
});

//SHOW - Show info about a single camp
router.get('/:id', function(req, res) {
    //Find the campground with :id
    //Takes the comment id and fetches the corresponding comment body then displays it
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err){
            console.log(err);
        }
        else {
            res.render("campgrounds/show", {camp: camp});
        }
    });
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;