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
                    
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

//edit comment
router.get("/:comments_id/edit", checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comments_id, function(err, foundComment){
        if(err){
            res.redirect("back");
        }else{
            res.render("comments/edit", {campground_id: req.params.id, comment: foundComment})
        }
    });
    
});

//Update comment
router.put("/:comments_id", checkCommentOwnership,function(req, res){
    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/" +req.params.id);
        }
    })
});

//DESTROY route: comment
router.delete("/:comments_id",checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comments_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/campgrounds/"+ req.params.id);
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

function checkCommentOwnership(req, res, next){
    if(req.isAuthenticated()){
    Comment.findById(req.params.comments_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    res.redirect("back");
                }
            }
    });

    }else{
        res.redirect("back");
    }

}


module.exports = router;