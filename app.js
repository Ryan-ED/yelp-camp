var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");
var methodOverride = require("method-override");
var flash = require("connect-flash");

var Campground = require("./models/campground");
var Comment = require("./models/comment");
var User = require("./models/user");
var seedDB = require("./seeds");

//Requiring routes
var commentRoutes = require("./routes/comments");
var campRoutes = require("./routes/campgrounds");
var indexRoutes = require("./routes/index");

// mongoose.connect("mongodb://localhost/yelp_camp", {useMongoClient: true});
mongoose.connect("mongodb://admin:catinthehat@ds247317.mlab.com:47317/ryan-ed_yelpcamp", {useMongoClient: true});
mongoose.Promise = global.Promise;

// seedDB();
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

app.use(flash());

//Passport Config
app.use(require("express-session")({
    secret: "This is supposed to be a random string, but I'm lazy",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Make the current user available to all templates
app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(methodOverride("_method"));

app.use(indexRoutes);
app.use("/campgrounds", campRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(process.env.PORT || 5000, function() {
    console.log('YelpCamp server has started!');
});