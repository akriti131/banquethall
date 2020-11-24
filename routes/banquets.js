var express = require("express");
var router = express.Router();
var Banquet = require("../models/banquet");
var middleware  = require("../middleware");

//INDEX - show all campgrounds
router.get("/", function(req, res){
    Banquet.find({}, function(err,allBanquets){
        if(err){
            console.log(err);
        }else{
            res.render("banquets/index", {banquets: allBanquets, currentUser: req.user});
        }
    });
});

//CREATE - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req ,res){
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var desc = req.body.description;
    var author ={
        id: req.user.id,
        username: req.user.username
    }
    var newBanquet = {name:name,price:price, image:image, description: desc, author: author};
    
    //Create a new campground and save on DB
    Banquet.create(newBanquet, function(err, newlyCreated){
        if(err){
            console.log(err);
        }else{
            //redirect back to campground page
            res.redirect("/banquets");
        }
    })
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("banquets/new");
});

//SHOW - shows more info about campgrounds
router.get("/:id", function(req, res){
    Banquet.findById(req.params.id).populate("comments").exec(function(err, foundBanquet){
        if(err || !foundBanquet){
            res.flash("error","Banquet not found");
            res.redirect("back");
        }else{
            res.render("banquets/show", {banquet: foundBanquet});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/:id/edit",middleware.checkBanquetOwnership, function(req, res){
    Banquet.findById(req.params.id, function(err, foundBanquet){
            res.render("banquets/edit", {banquet: foundBanquet});
        }); 
});

router.put("/:id",middleware.checkBanquetOwnership, function(req, res){
    Banquet.findByIdAndUpdate(req.params.id, req.body.banquet, function(err, updatedBanquet){
        if(err){
            res.redirect("/banquets");
        }else{
            res.redirect("/banquets/" + req.params.id);
        }
    });
});

// DESTROY CAMPFROUNDS ROUTE
router.delete("/:id",middleware.checkBanquetOwnership, function(req, res){
    Banquet.findByIdAndRemove(req.params.id, function(err){
        if(err){
            res.redirect("/banquets");
        }else{
            res.redirect("/banquets");
        }
    })
});

module.exports = router;

