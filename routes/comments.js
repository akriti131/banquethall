var express = require("express");
var router = express.Router({mergeParams:true});
var Banquet = require("../models/banquet");
var Comment = require("../models/comment");
var middleware  = require("../middleware");


//=====================================
//COMMENTS ROUTES
//=====================================

router.get("/new",middleware.isLoggedIn, function(req, res){
    Banquet.findById(req.params.id, function(err, banquet){
        if(err){
            console.log(err);
        }else{
            res.render("comments/new", {banquet: banquet});
        }
    });
});

router.post("/",middleware.isLoggedIn, function(req, res){
    Banquet.findById(req.params.id, function(err, banquet){
        if(err){
            console.log(err);
            res.redirect("/banquets");
        }else{
            Comment.create(req.body.comment, function(err, comment){
                if(err){
                    req.flash("error", "Something went wrong");
                    console.log(err);
                }else{
                    comment.author.id = req.user.id;
                    comment.author.username = req.user.username;
                    comment.save();
                    banquet.comments.push(comment);
                    banquet.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/banquets/" + banquet.id );
                }
            });
        }
    });
});

router.get("/:comment_id/edit",middleware.checkCommentOwnership, function(req, res){
    Banquet.findById(req.params.id, function(err, foundBanquet){
        if(err || !foundBanquet){
            req.flash("error", "No banquet found");
            return res.redirect("back");
        }
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err){
                res.redirect("back");
            }else{
                res.render("comments/edit", {banquet_id: req.params.id, comment : foundComment});
            }
        });
    });
});

router.put("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            res.redirect("back");
        }else{
            res.redirect("/banquets/" + req.params.id);
        }
    })
});

router.delete("/:comment_id",middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        }else{
            req.flash("success", "Comments deleted");
            res.redirect("/banquets/" + req.params.id);
        }
    });
});

module.exports = router;