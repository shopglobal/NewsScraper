// Dependencies
// =============================================================
const express = require('express');
const bodyParser = require('body-parser');
const exphbs = require('express-handlebars');
const request = require('request');
const cheerio = require('cheerio');
var morgan = require('morgan');
const logger = require('mongo-morgan-ext');
const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
// Sets up the Express App
// =============================================================
const app = express();
const PORT = process.env.PORT || 3000;

// Sets up the Express app to handle data parsing
// =============================================================
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: 'application/vnd.api+json' }));

// Set Handlebars as the default templating engine.
// =============================================================
let hbs = exphbs.create({
    defaultLayout: 'news',
})

// log every request to the console
app.use(morgan('dev'));
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

// Static directory
// =============================================================
app.use(express.static('public'));

// Routes
// =============================================================
let htmlRoute = require('./routes/html-route.js');
app.use('/', htmlRoute);

// Requiring our models for syncing
// =============================================================
let collection = 'Logs';
const article = require('./models/Articles');
const comment = require('./models/Comments');
let newsdb = 'mongodb://localhost/newsdbs';
let db = 'mongodb://localhost/newsdbs';
let scraper = require('./db/articleScraper');
var skipfunction = function(req, res) {

return res.statusCode > 399;
} //Thiw would skip if HTTP request response is less than 399 i.e no errors.
// connection set to follow Mongo protocol below, with callback method
app.use(logger(db,collection,skipfunction)); //In your express-application
var options = {
  useMongoClient: true,
  // autoIndex: false, // Don't build indexes (not necessary in most cases.)
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 500ms
  poolSize: 5, // Maintain up to 10 socket connections
  promiseLibrary: require('bluebird'),
  // If not connected, return errors immediately rather than waiting for reconnect
  bufferMaxEntries: 0
};
mongoose.connect(newsdb, options);

// Starting our Express app
// =============================================================
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});
