var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp");
seedDB();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res) {
    res.render("landing");
});

//INDEX - Show all camps
app.get('/campgrounds', function(req, res) {
    //Get all campgrounds from DB
    Campground.find({}, function(err, camps){
        if(err){
            console.log(err);
        }
        else {
            res.render("index", {camps: camps});
        }
    });
});

//CREATE - Add new camp
app.post('/campgrounds', function(req, res) {

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

//NEW - Show form to create new camp
app.get('/campgrounds/new', function(req, res) {
    res.render("new");
});

//SHOW - Show info about a single camp
app.get('/campgrounds/:id', function(req, res) {
    //Find the campground with :id
    Campground.findById(req.params.id).populate("comments").exec(function(err, camp){
        if(err){
            console.log(err);
        }
        else {
            res.render("show", {camp: camp});
        }
    });
});

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});