var Campground = require("../models/campground");
var Comment = require("../models/comment");

//All middleware
var middlewareObj = {};

middlewareObj.checkCampOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //if logged in
        Campground.findById(req.params.id, function(err, camp){//find campground
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(camp.author.id.equals(req.user._id)){//if author id matched signed in user id
                    next();//move on
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){ //if logged in
        Comment.findById(req.params.cId, function(err, comment){//find comment
            if(err){
                console.log(err);
                res.redirect("back");
            } else {
                if(comment.author.id.equals(req.user._id)){//if author id matched signed in user id
                    next();//move on
                } else {
                    res.redirect("back");
                }
            }
        })
    } else {
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function (req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = middlewareObj;