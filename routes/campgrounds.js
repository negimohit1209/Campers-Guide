var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware/index.js");



router.get("/", function(req, res){
    //Get all the campgrounds from DB
    Campground.find({},function(err, allCampgrounds){
       if(err){
           console.log(err);
       }
       else{
            res.render("campgrounds/index", {campgrounds:allCampgrounds , currentUser: req.user});
       }
    });
    
});

router.get("/new", middleware.isLoggedIn, function(req, res){
   res.render("campgrounds/new"); 
});


router.post("/", middleware.isLoggedIn, function(req, res){
    //get data from form and add to campground array
    //redirect to campground
    //req is used to get the values coming from the form @ /new
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var price = req.body.price;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {name: name,price: price, image: image , description: desc ,author: author};
    //create new campground and save to database
    Campground.create(newCampground, function(err, newlycreated){
        if(err){
            req.flash("error", "something went wrong");
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});


//Shows more infornation of a campground
router.get("/:id", function(req,res){
    //we will use findById method
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground, currentUser: req.user});
        }
    });
    
});

//EDIT Campground ROUTE
router.get("/:id/edit",middleware.checkCampgroundOwnership,  function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
});

//Update campground route

router.put("/:id" , middleware.checkCampgroundOwnership, function(req, res){
    //find and update the correct campground
    //redirect somewhere(show page)
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            //console.log(err);
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    } );
});


//Detroy campground route

router.delete("/:id" , middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds");
        }
    });
});






module.exports = router;
