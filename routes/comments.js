var express = require("express");
var router = express.Router({mergeParams: true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//============================================================
//Comment routes
//===========================================================
router.get("/new", isLoggedIn ,function(req, res){
    //find campground by id
    Campground.findById(req.params.id, function(err , campground){
        if(err){
            console.log(err);
        }
        else{
            res.render("comments/new", {campground: campground})
        }
    })
});


router.post("/" , isLoggedIn, function(req,res){
    //lookup campground using id
    // create new comment
    // connect new comment to campground
    //redirect to campground show page
    Campground.findById(req.params.id, function(err, campground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds")
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    console.log(err);
                }else{
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save();
                    console.log(comment);
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//middle ware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}


module.exports = router;