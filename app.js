/*
author: wingkwong
*/

var express = require('express');
var app = express();
var fs = require('fs');
var session = require('express-session');
var path = require('path');
var mongo = require('mongodb');
var morgan = require('morgan');
var ejs = require('ejs');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 10850;
const MongoClient = require('mongodb').MongoClient;



/*
App Configuration
*/

app.all("/*", function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, Pragma, Origin, Authorization, Content-Type, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  return next();
});

// EXPRESS
app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '30mb'}));
app.use(bodyParser.urlencoded({ extended: true, limit: '30mb' }));

app.set('view engine', 'ejs'); 
app.engine('ejs', require('ejs').renderFile);

//Session
app.use(session({
	secret:'ilovehk',
    proxy: true,
    resave: true,
    saveUninitialized: true
})); 

// ROUTE
require('./route'); 

console.log("Connecting to MongoDB");

/*
	Use static folder web
*/
app.set('views', path.join(__dirname, 'web'));
app.use(express.static('web'));


app.use('/img', express.static('img'));
app.use('/profileImg', express.static('profileImg'));
//for demo only
app.use('/tmp', express.static('tmp'));


//route
app.get('/', function(req, res) {
        res.render('login.ejs', {
		});
    });
app.get('/detail', function(req, res) {
        res.render('restaurant.ejs', {
		});
    });
app.get('/mainpage', function(req, res) {
        res.render('mainpage.ejs', {
		});
    });
app.get('/rate', function(req, res) {
        res.render('rate.ejs', {
		});
    });

app.get('/edit', function(req, res) {
        res.render('edit.ejs', {
		});
    });
	
app.get('/create', function(req, res) {
        res.render('create_restaurant.ejs', {
		});
    });	
	
app.get('/logout', function(req, res) {
        res.render('login.ejs', {
		});
    });
	
var db
MongoClient.connect('mongodb://comps381f:comps381f@ds141274.mlab.com:41274/steveysh', (err, database) => {
  if (err) return console.log(err)
  db = database;
app.listen(port, function () {
  console.log('App is listening on port ' + port);
 });
});

/*app.listen(port, function () {
  console.log('App is listening on port ' + port);
 });*/