var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var passport = require("passport");
var localStrategy = require("passport-local");


var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");


mongoose.connect("mongodb://localhost/yelp_camp");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"))
app.set("view engine", "ejs");

// console.log(__dirname);

//seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this will be used for the hash function",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//middleware to send req.user to evrey route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});


app.get("/", function(req, res){
    res.render("landing");
});


app.get("/campgrounds", function(req, res){
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

app.get("/campgrounds/new", function(req, res){
   res.render("campgrounds/new"); 
});

app.post("/campgrounds", function(req, res){
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
app.get("/campgrounds/:id", function(req,res){
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


//============================================================
//Comment routes
//===========================================================
app.get("/campgrounds/:id/comments/new", isLoggedIn ,function(req, res){
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


app.post("/campgrounds/:id/comments" , isLoggedIn, function(req,res){
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

//=================================================
//AUTH routes
//==================================================

//show register
app.get("/register", function(req,res){
    res.render("register");
});

//handle signup logic
app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register")
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/campgrounds");
        });
    });
});

//SHOW LOGIN form
app.get("/login" , function(req, res){
    res.render("login");
});

//handle login logic
app.post("/login", passport.authenticate("local",{
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res){
});


//LogOut route
app.get("/logout", function(req,res){
    req.logout();
    res.redirect("/campgrounds");
});

function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/login");
}

app.listen('3000', 'localhost', function(){
    console.log("yelpcamp has started");
});