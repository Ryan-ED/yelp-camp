var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//NEW
router.get('/new', isLoggedIn, function(req, res) {
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
router.post('/', isLoggedIn, function(req, res) {
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
                    //Add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save(); //Save comment before pushing to camp
                    camp.comments.push(comment);
                    camp.save();
                    res.redirect("/campgrounds/" + camp._id);
                }
            });
        }
    });
    
});

//EDIT
router.get('/:cId/edit', function(req, res){
    Comment.findById(req.params.cId, function(err, comment){
        res.render("comments/edit", {campId: req.params.id, comment: comment});
    })
});

//UPDATE
router.put('/:cId', function(req, res){
    Comment.findByIdAndUpdate(req.params.cId, req.body.comment, function(err, comment){
        res.redirect("/campgrounds/" + req.params.id);
    })
});

//DELETE
router.delete('/:cId', function(req, res){
    Comment.findByIdAndRemove(req.params.cId, function(err){
        res.redirect("/campgrounds/" + req.params.id);
    })
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

module.exports = router;