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



// ROUTE
require('./route'); 

/*
fs.readdirSync('./controllers').forEach(function (file) {
  if(file.substr(-3) == '.js') {
      route = require('./controllers/' + file);
      route.controller(app);
  }
});


/*
	MongoDB
*/

//DEV


//PRD
//mongoose.connect('mongodb://wingkwong:tplNPyl1FB@mongodb.cloudno.de:27017/sepj');

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
app.get('/login', function(req, res) {
        res.render('login.ejs', {
		});
    });

app.get('/edit', function(req, res) {  //Some error in edit two file
        res.render('edit.ejs', {
		});
    });
app.get('/create_restaurant', function(req, res) {
        res.render('create_restaurant.ejs', {
		});
    });

	
app.listen(port, function () {
  console.log('App is listening on port ' + port);
});