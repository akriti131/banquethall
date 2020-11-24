var Banquet = require("../models/banquet");
var Comment = require("../models/comment");

var middlewareObj = {};

middlewareObj.checkBanquetOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Banquet.findById(req.params.id, function(err, foundBanquet){
            if(err || !foundBanquet){
                req.flash("error", "Banquet not found");
                res.redirect("back");
            }else{
                if(foundBanquet.author.id.equals(req.user.id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
                
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that!!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next){
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(err, foundComment){
            if(err || !foundComment){
                req.flash("error","Comment not found");
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user.id)){
                    next();
                }else{
                    req.flash("error", "You don't have permission to do that");
                    res.redirect("back");
                }
                
            }
        });
    }else{
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!!");
    res.redirect("/login");
}

module.exports = middlewareObj;