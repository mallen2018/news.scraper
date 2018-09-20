"use strict";

var Nightmare = require("nightmare");

var nightmare = Nightmare({ show: true });

nightmare
  .goto("https://npr-news-app.herokuapp.com/scrape")
  .click("a#save")
  .goto("https://npr-news-app.herokuapp.com/articles")
  .click("#note.collapsible-header")
  .type("")