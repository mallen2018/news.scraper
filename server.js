//Dependencies
var mongoose = require("mongoose");
var bodyParser = require("body-parser");
var express = require("express");
var exphbs = require("express-handlebars");
var methodOverride = require("method-override");
var path = require("path");
//debugging tool
var logger = require("morgan");
//scraping tools
var cheerio = require("cheerio");
var request = require("request");

//require Article and Note models
var Article = require("./models/Article.js");
var Note = require("./models/Note.js");

//Set mongoose to leverage built in JavaScript ES6 Promises
mongoose.Promise = Promise;

//set port to 3000 or whichever one is used in environment variable
var PORT = process.env.PORT || 3000;

//set up express
var app = express();

//set the app up with body-parser and a static folder
app.use(bodyParser.urlencoded({
    extended: false
}));

//user method override to enable DELETE and PUT
app.use(methodOverride("_method"));

//serve static content for the app from the "public" directory in the application directory
app.use(express.static(path.join(__dirname, "public")));

//handlebars setup as view engine
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//Database configuration with mongoose===================================================================
var MONGODB = process.env.MONGODB_URI || "mongodb://localhost/NPRarticles";
mongoose.connect(MONGODB, { useNewUrlParser: true });
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);
var db = mongoose.connection;

//Show any mongoose errors
db.on("error", function(error) {
    console.log("Mongoose Error: ", error);
});

//Once logged in to the db through mongoose, log a success message
db.once("open", function() {
    console.log("Mongoose connection successful.");
    // Listen on PORT
    app.listen(PORT, function() {
        console.log("App running on port 3000!");
    });
});

//Routes -- put them in a different folder and require them here
//=======================================================================================
//import routes and controller
var routes = require("./controllers/controller.js");
app.use("/", routes);
