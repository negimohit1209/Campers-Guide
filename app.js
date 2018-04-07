var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var flash = require("connect-flash");
var passport = require("passport");
var methodOverride = require("method-override");
var localStrategy = require("passport-local");


var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var User = require("./models/user");


var commentRoutes       = require("./routes/comments"),
    campgroundRoutes    = require("./routes/campgrounds"),
    indexRoutes         = require("./routes/index")


console.log(process.env.DATABASEURL);

mongoose.connect(process.env.DATABASEURL);


//mongoose.connect("mongodb://mohit:mohit@ds237489.mlab.com:37489/camper_guide");


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(flash());

// console.log(__dirname);


//seedDB();  //seed database
//PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "this will be used for the hash function",
    resave: false,
    saveUninitialized: false
}));
//middleware to send req.user to evrey route
//to send message to every routes
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});




app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.get("/", function(req, res){
    res.render("landing");
});



app.listen(process.env.PORT, process.env.IP, function(){
    console.log("yelpcamp has started");
});