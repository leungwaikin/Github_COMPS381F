
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
var http = require('http');
var url  = require('url');
var MongoClient = require('mongodb').MongoClient; 
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;


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

//login

   app.get('/', function(req, res) {
        res.render('login.ejs', {
			fun : tesing()
		});
    });
	
	//Render create
	 app.get('/create', function(req, res) { 
	  res.render('create.ejs', {
		});
    });
	
    //Create
   app.post('/create', function(req, res) { 
		var name =	req.body.name;	 
        var borough =req.body.borough;
		var cuisine =req.body.cuisine;
		var street =req.body.street;
		var building=req.body.building;
		var zipcode=req.body.zipcode;
		var lon=req.body.lon;
		var lat=req.body.lat;
		var image =req.body.image;
		
		/*To-DO insert data to mongodb*/ 
        /*res.render('login.ejs', {
            name:req.name,
			password:req.password		
        });
    });
	
	 //CREATE
    /*app.post('/create', function(req, res) {  //Requirement 2
        res.render('mainpage.ejs', {
           /* name:req.name,
			borough:req.borough,	
			cuisine:req.cuisine,
			image:req.image,
			mimetype=image.mimetype,
			street=req.street,
			building=req.building,
			zipcode=req.zipcode,
			coord=[req.lon,req.lan]
        });*/
    });
	
	//Register	
    app.post('/register',function(req,res){
		var username =req.body.username; //Requirement 1
		var password =req.body.password;
	});
    //LOGOUT
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
	
	//Rate
	app.get('/rate/:id', function(req, res) {
        res.render('rate.ejs', {
		});
    });
	
// put rate
	app.put('/rate/:id', function(req, res) {
        res.render('rate.ejs', {
		});
    });
    // REGISTER
    app.get('/register', function(req, res) {
        res.render('register.ejs', {
          
        });
    });
	
	//Detail
	app.get('/detail', function(req, res) {		
        res.render('restaurant.ejs', {
		});
    });
	
	//MAIN Page
	app.get('/read', function(req, res) {
        res.render('mainpage.ejs', {
		/*var criteria = {};
			for (key in req.query) {
				criteria[key] = req.query[key];
			}
		});
		MongoClient.connect(mongourl, function(err, db) {
		assert.equal(err,null);
		console.log('Connected to MongoDB\n');
		findRestaurants(db,criteria,function(restaurants) {
			db.close();
			console.log('Disconnected MongoDB\n');
			return(restaurants);
			}
		 }); 
	    });*/
    });
	//detail page
	app.get('/detail', function(req, res) {
        res.render('restaurant.ejs', {
		   /*var id=req.query.id;
		    MongoClient.connect(mongourl, function(err, db) {
                assert.equal(err, null);
                console.log('Connected to MongoDB\n');
                db.collection('restaurants').findOne({_id: ObjectId(id)},function(err,doc) {
				assert.equal(err,null);
				db.close();
				console.log('Disconnected from MongoDB\n');
				return doc;
		       });*/
            });
		});
    });
	
	//edit
	app.get('/edit', function(req, res) {
        res.render('change.ejs', {
		});
    });
	
var db;
MongoClient.connect('mongodb://comps381f:comps381f@ds141274.mlab.com:41274/steveysh', (err, database) => {
  if (err) return console.log(err)
  db = database;
app.listen(port, function () {
  console.log('App is listening on port ' + port);
 });
});
<<<<<<< HEAD
function tesing(){
	console.log("show");
}
=======

/*
function findRestaurants(db,criteria,callback) {
	var restaurants = [];
	cursor = db.collection('restaurants').find(criteria); 				
	cursor.each(function(err, doc) {
		assert.equal(err, null); 
		if (doc != null) {
			restaurants.push(doc);
		} else {
			callback(restaurants); 
		}
	});
}
*/
>>>>>>> 21db19a904ae95633813cf9a64122b5ec504ff42
/*app.listen(port, function () {
  console.log('App is listening on port ' + port);
 });*/