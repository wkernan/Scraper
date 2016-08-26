var express = require('express');
var exphbs  = require('express-handlebars');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var request = require('request'); 
var cheerio = require('cheerio');

app.use(bodyParser.urlencoded({
  extended: false
}));


app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// make public a static dir
app.use(express.static('assets'));

// Database configuration with mongoose
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/bootcamp-scraper');
var db = mongoose.connection;

// show any mongoose errors
db.on('error', function(err) {
  console.log('Mongoose Error: ', err);
});

// once logged in to the db through mongoose, log a success message
db.once('open', function() {
  console.log('Mongoose connection successful.');
});



var routes = require('./controllers/routes.js');
app.use('/', routes);

app.listen(3000, function() {
  console.log('App running on port 3000!');
});