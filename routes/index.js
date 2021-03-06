var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

router.get('/', function(req, res) {
    res.render("landing");
});

//Register
router.get('/register', function(req, res) {
    res.render("register");
});

router.post('/register', function(req, res) {
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            req.flash("error", err.message);
            res.redirect("register");
        } else {
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "You're all signed up! Welcome   *\\(^_^)/*");
                res.redirect("/campgrounds");
            })
        }
    })
});

//Login
router.get('/login', function(req, res) {
    res.render("login");
});

router.post('/login', passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true
    }), function(req, res) {
    
});

//Logout
router.get('/logout', function(req, res) {
    req.logout();
    req.flash("success", "Logged out. See ya!");
    res.redirect("/");
});

module.exports = router;