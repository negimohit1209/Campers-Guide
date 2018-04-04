var express = require("express");
var router = express.Router();

//============================================================
//Comment routes
//===========================================================
router.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req, res){
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


router.post("/campgrounds/:id/comments" , isLoggedIn, function(req,res){
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
                    campground.comments.push(comment);
                    campground.save();
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});

module.export = router;