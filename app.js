var express                = require("express");
var bodyParser             = require("body-parser");
var mongoose               = require("mongoose");
var flash                  = require("connect-flash");
var passport               = require("passport");
var LocalStrategy          = require("passport-local");
var methodOverride         = require("method-override");
var Banquet                = require("./models/banquet");
var Comment                = require("./models/comment");
var User                   = require("./models/user");
var seedDB                 = require("./seed");

var commentRoutes          = require("./routes/comments");
var banquetRoutes          = require("./routes/banquets");
var indexRoutes            = require("./routes/index");

var app                    = express();

 mongoose.connect("mongodb+srv://dbUser:dbUser@cluster0.nhfz5.mongodb.net/dbUser?retryWrites=true&w=majority", {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
   


app.use(express.json({extended:false}));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());

//seedDB();

//Passport configuration
app.use(require("express-session")({
    secret:"I love Koreans",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(indexRoutes);
app.use("/banquets/:id/comments", commentRoutes);
app.use("/banquets",banquetRoutes);



app.listen(8000, function(){
    console.log("Banquet server started");
});