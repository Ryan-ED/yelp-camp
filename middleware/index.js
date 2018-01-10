var Campground = require("../models/campground");
var Comment = require("../models/comment");

//All middleware
var middlewareObj = {};

middlewareObj.checkCampOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //if logged in
        Campground.findById(req.params.id, function(err, camp){//find campground
            if(!camp || err){
                console.log(err);
                req.flash("error", "Campground not found");
                res.redirect("/campgrounds");
            } else {
                if(camp.author.id.equals(req.user._id)){//if author id matched signed in user id
                    next();//move on
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        })
    } else {
        req.flash("error", "Please log in first...");
        res.redirect("/login");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //if logged in
        Comment.findById(req.params.cId, function(err, comment){//find comment
            if(!comment || err){
                console.log(err);
                req.flash("error", "Comment not found");
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){//if author id matched signed in user id
                    next();//move on
                } else {
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            }
        })
    } else {
        req.flash("error", "Please log in first...");
        res.redirect("/login");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        next();
    } else {
        req.flash("error", "Please log in first...");
        res.redirect("/login");
    }
}

module.exports = middlewareObj;