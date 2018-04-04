// var mongoose = require("mongoose");


// var campgroundSchema = new mongoose.Schema({
//     name: String,
//     image: String,
//     description: String
// });


// var Campground = mongoose.model("Campground", campgroundSchema);
// module.exports = Campground;

//copied
var mongoose = require("mongoose");
 
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author: {
   	id: {
   		type: mongoose.Schema.Types.ObjectId,
   		ref: "User"
   	},
   	username: String
   },
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ]
});
 
module.exports = mongoose.model("Campground", campgroundSchema);