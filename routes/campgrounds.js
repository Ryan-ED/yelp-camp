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
        description: req.body.description,
        author: {
            id: req.user._id,
            username: req.user.username
        }
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

//EDIT
router.get('/:id/edit', function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", {camp: camp});            
        }
    })
});

//UPDATE
router.put('/:id', function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp){
        if(err){
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//DELETE
router.delete('/:id', function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");            
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