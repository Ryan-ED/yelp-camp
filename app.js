var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");
var seedDB = require("./seeds");

mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.Promise = global.Promise;
seedDB();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

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
            res.render("campgrounds/index", {camps: camps});
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
    res.render("campgrounds/new");
});

//SHOW - Show info about a single camp
app.get('/campgrounds/:id', function(req, res) {
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

//=======================
//COMMENTS ROUTES
//=======================

//NEW
app.get('/campgrounds/:id/comments/new', function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
        }
        else {
            res.render("comments/new", {camp: camp});
        }
    });
});

//CREATE
app.post('/campgrounds/:id/comments', function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }
                else {
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
    
});

app.listen(3000, function() {
    console.log('App listening on port 3000!');
});