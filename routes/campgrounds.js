var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

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
router.get('/new', middleware.isLoggedIn, function(req, res) {
    res.render("campgrounds/new");
});

//CREATE - Add new camp
router.post('/', middleware.isLoggedIn, function(req, res) {

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
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
        else {
            req.flash("success", "Camp added. Nice one!");
            res.redirect("/campgrounds/" + camp._id);
        }
    });
});

//SHOW - Show info about a single camp
router.get('/:id', function(req, res) {
    //Find the campground with :id
    //Takes the comment id and fetches the corresponding comment body then displays it
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(!camp || err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("/campgrounds");
        }
        else {
            res.render("campgrounds/show", {camp: camp});
        }
    });
});

//EDIT
router.get('/:id/edit', middleware.checkCampOwnership, function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(!camp || err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            res.render("campgrounds/edit", {camp: camp}); 
        }
    })
});

//UPDATE
router.put('/:id', middleware.checkCampOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.camp, function(err, camp){
        if(!camp || err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Camp updated. Cool!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//DELETE
router.delete('/:id', middleware.checkCampOwnership, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Hey! Where'd your camp go?");
            res.redirect("/campgrounds");            
        }
    });
});

module.exports = router;