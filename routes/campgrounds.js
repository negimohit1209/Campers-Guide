var express = require("express");
var router = express.Router();


router.get("/", function(req, res){
    res.render("landing");
});


router.get("/campgrounds", function(req, res){
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

router.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

router.post("/campgrounds", function(req, res){
    //get data from form and add to campground array
    //redirect to campground
    //req is used to get the values coming from the form @ /new
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image , description: desc};
    //create new campground and save to database
    Campground.create(newCampground, function(err, newlycreated){
        if(err){
            console.log(err);
        }
        else
        {
            res.redirect("/campgrounds");
        }
    });
});


//Shows more infornation of a campground
router.get("/campgrounds/:id", function(req,res){
    //we will use findById method
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        }else{
            //console.log(foundCampground);
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
    
});

module.export = router;
