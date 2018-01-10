var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware");

//NEW
router.get('/new', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(!camp || err){
            console.log(err);
            res.redirect("back");
        }
        else {
            res.render("comments/new", {camp: camp});
        }
    });
});

//CREATE
router.post('/', middleware.isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, camp){
        if(!camp || err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        }
        else {
            Comment.create(req.body.comment, function(err, comment){
                if(!comment || err){
                    console.log(err);
                    req.flash("error", "Something went wrong!");
                    res.redirect("back");
                }
                else {
                    //Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(); //Save comment before pushing to camp
                    camp.comments.push(comment);
                    camp.save();
                    req.flash("success", "Nice comment...");
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
    
});

//EDIT
router.get('/:cId/edit', middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.cId, function(err, comment){
        if(!comment || err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            res.render("comments/edit", {campId: req.params.id, comment: comment});
        }
    })
});

//UPDATE
router.put('/:cId', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.cId, req.body.comment, function(err, comment){
        if(!comment || err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Comment ammended!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

//DELETE
router.delete('/:cId', middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.cId, function(err){
        if(err){
            console.log(err);
            req.flash("error", "Something went wrong!");
            res.redirect("back");
        } else {
            req.flash("success", "Mission: Destroy Comment - Successful!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});

module.exports = router;