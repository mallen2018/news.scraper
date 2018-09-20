//dependencies
var path = require("path");
var request = require("request");
var cheerio = require("cheerio");
var express = require("express");
var router = express.Router();

//import Note and Article models
var Note = require("../models/Note.js");
var Article = require("../models/Article.js");

router.get("/", function(req, res) {
    res.render("index");
});

//A GET request to scrape the NPR.org website for newsarticles
router.get("/scrape", function(req, res) {
    //First, we grab the body of the html with request
    request("http://www.npr.org/sections/news/", function(error, response, html) {
        //Then we load it into cheerio and save it to $ for a shorthand selector
        var $ = cheerio.load(html);
        var num = 0;
        //array to hold articles and send them back to browser
        var articles = [];
        //Grab every item.has-image and get their title, link, teaser text and image link
        $(".item.has-image").each(function(i, element) {
            num = (i);
            //save and empty result object
            var result = {};
            //add selected information for each article as properties of the results object
            result.title = $(this).children(".item-info").find("h2.title").text();
            result.link = $(this).children(".item-info").find("h2.title").find("a").attr("href");
            result.teaser = $(this).children(".item-info").find("p.teaser").text();
            result.imgLink = $(this).children(".item-image").find("a").find("img").attr("src");
            //if we get valid result push object into array
            if (result.title && result.link && result.teaser && result.imgLink) {
                articles.push(result);
            }
        });
        var hbsObject = { article: articles, num: num };
        //redirect to articles page and display results
        res.render("index", hbsObject);
    });

});

//route to save an article
router.post("/save", function(req, res) {
    var newArticle = new Article(req.body);
    newArticle.save(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            res.send("Article has been saved");
        }
    })
});

//route to display articles
// This will get the articles we scraped from the mongoDB
router.get("/articles", function(req, res) {
    // Grab every doc in the Articles array
    Article.find().sort({ "_id": -1 })
        .populate("note").
    exec(function(err, doc) {
        // console.log(doc);
        // Log any errors
        if (err) {
            console.log(err);
        }
        // Or send the doc to the browser as a json object
        else {
            var hbsObject = {
                savedArticle: doc
            };
            res.render("saved", hbsObject);
        }
    });
});

//delete article == make sure notes are deleted, too
router.delete("/delete/:id", function(req, res) {
    //find article to delete its notes
    Article.findOne({ "_id": req.params.id }, function(err, data) {
        if (err) {
            console.log(err);
        } else if (data.note) {
            console.log("deleting note");
            var noteIDs = data.note;
            //loop through notes array to delete all notes linked to this article
            for (var i = 0; i < noteIDs.length; i++) {
                Note.find(noteIDs[i], function(error, doc) {
                    if (error) {
                        console.log(error)
                    }
                });
            }
        }
    });

    //delete article
    Article.findByIdAndRemove(req.params.id, function(error, doc) {
        if (error) {
            console.log(error);
        }
        res.send(doc);
    });
});

//add a note to an article
router.post("/articles/:id", function(req, res) {
    //create a new note and pass the req.body to the entry
    var newNote = new Note(req.body);
    //save new note to database
    newNote.save(function(error, doc) {
        if (error) {
            console.log(error);
        } else {
            //use the article id to find and update it's note
            Article.findOneAndUpdate({ "_id": req.params.id }, { $push: { "note": doc._id } }, { new: true })
                //execute the above entry
                .exec(function(err, doc) {
                    if (err) {
                        console.log(err);
                    } else {
                        res.redirect("/articles");
                    }
                });
        }
    });
});

//delete a note
router.delete("/delete/notes/:id", function(req, res) {
    var id = req.params.id;

    Note.findByIdAndRemove({ "_id": req.params.id }, function(err, doc) {
        if (err) {
            console.log(err);
        }
    });
});



//route to delete notes
module.exports = router;
