
var express = require('express');
var app = express();
var fs = require('fs');
var session = require('express-session');
var path = require('path');
var mongo = require('mongodb');
var morgan = require('morgan');
var ejs = require('ejs');
var passport = require('passport');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var port = process.env.PORT || 10850;
const MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const fileUpload = require('express-fileupload');

var gulp = require('gulp'),
    data = require('gulp-data'),
    exif = require('gulp-exif'),
    extend = require('gulp-extend');
	
/*var assert = require('assert');
var url = 'mongodb://comps381f:comps381f@ds141274.mlab.com:41274/steveysh';*/



/*
App Configuration
*/
//require('./config/passport')(passport);

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
app.use(fileUpload());
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'ejs'); 
app.engine('ejs', require('ejs').renderFile);

var SECRETKEY1 = 'I want to pass COMPS381F';
var SECRETKEY2 = 'Keep this to yourself';

var users = new Array(
	{name: 'developer', password: 'developer'},
	{name: 'guest', password: 'guest'}
);
//Session
app.use(session({
	secret:'ilovehk',
	keys: [SECRETKEY1,SECRETKEY2],
    proxy: true,
    resave: true,
    saveUninitialized: true,
	duration: 30 * 60 * 1000,
    activeDuration: 5 * 60 * 1000,
})); 

// ROUTE
//require('./route')(app,passport);

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
	
var db;
MongoClient.connect('mongodb://comps381f:comps381f@ds141274.mlab.com:41274/steveysh', (err, database) => {
  if (err) return console.log(err)
  db = database;
app.listen(port, function () {
   console.log('App is listening on port ' + port);
 });
});
//login

   app.get('/', function(req, res) {
        res.render('login.ejs', {
		});
    });

	
	app.post('/login',function(req,res,next) {
	console.log("Entered:"+req.body.username);
	console.log("Entered:"+req.body.password);
	for (var i=0; i<users.length; i++) {
		if (users[i].name == req.body.username &&
		    users[i].password == req.body.password) {
			req.session.authenticated = true;
			req.session.username = users[i].name;
			console.log("Got:"+ req.session.username);
			res.redirect('/read');
			return next()
		}
	}
	res.redirect('/');
  });
//Google Map
   app.get("/gmap",isLoggedIn,function (req,res)
    {
        var lat = req.query.lat;
        console.log("lat : " + lat);
        var lon = req.query.lon;
        console.log("lon : " + lon);
         var title = req.query.title;
        console.log("title : " + title);
        res.render("index.ejs", {title:title, lat:lat, lon:lon});
    });	
//edit
   app.get('/change',function(req,res){
	 
	   var got_id =req.query._id;
		console.log(req.session.username +"changing doc");
		db.collection('restaurant').findOne({_id:ObjectId(got_id)},function(err,result){
		if(result.creator!=req.session.username){
			var message = "you are not the owner";
		  res.render('remove.ejs',{message: message});
		}else{
		var restaurant=[];
		var cursor=db.collection('restaurant').find({_id: ObjectId(got_id)});
		cursor.each(function(err,doc){  
		  if(doc!=null){
		    console.log(doc);
		    restaurant.push(doc);
		   }else{
			   
		
		     res.render('change.ejs', {result:restaurant ,action:"change"});
		   }
		});
		
		}
		});
   });
	
	
    //Create
   app.post('/new', function(req, res) { 
   //base64
   var imageString ="";
   console.log(req.files.ima);
      //console.log(req.files);
		if (req.files.ima){
		let image = req.files.ima;
		var imgName = new Date().getTime();
		var newPath = __dirname + "/img/" + imgName + ".png";
		imageString = imgName;
		console.log("newPath="+newPath);
		 image.mv(newPath, function(err) {
			 
			if (err)
			console.log(err)
			
			
   
		 
  });
		}
		
		
		//var imgData = req.body.image;

                //Check if imgData is null or not
                /*if (imgData != null) {
                    //Filter data:URL
                    var base64Data = imgData.replace(/^data:image\/\w+;base64,/, "");
                    var buffer = new Buffer(base64Data, 'base64');

                    //Using the upload-time to name the image
                    var imgName = new Date().getTime();

                    event.local.filename = imgName;
                    //Declare a new path for storing image
                    var newPath = __dirname + "/img/" + imgName + ".png";
                    fs.writeFile(newPath, buffer, function(err) {
                        if (err) {
                            // res.send(err);
                        } else {
                            console.log(err);
                            //res.send("Image Saved");
                        }
                    });
                }*/
				//end base64

		
		var createObj = {};		
		createObj=req.body;		
		createObj.grade=[];		
		createObj.address={};
		createObj.image=imageString; 
		createObj.creator= req.session.username;
		//if(req.body.street||req.body.building||req.body.zipcode){
		createObj.address.street=req.body.street;
		createObj.address.building=req.body.building;
		createObj.address.zipcode=req.body.zipcode;
		 //}
		 delete createObj.street;
		 delete createObj.building;
		 delete createObj.zipcode;
		//console.log(req.body.street);
		 /*createObj.name =req.body.name;	 
         createObj.borough =req.body.borough;
		 createObj.cuisine =req.body.cuisine;
		 
		 createObj.address.street =req.body.street;
		 createObj.address.building=req.body.building;
		 createObj.address.zipcode=req.body.zipcode;
		 createObj.lon=req.body.lon;
		 createObj.lat=req.body.lat;
		 createObj.image =req.body.image;
		 createObj.address.street.replace('null','');
		 createObj.address.building.replace('null','');
		 createObj.address.zipcode.replace('null','');*/

		console.log("new="+JSON.stringify(createObj));
		
		/*To-DO insert data to mongodb*/ 
		 db.collection('restaurant').insert(createObj,(err, restaurant) => {
		if (err) 	
			console.log(err);
		else
		 res.render('restaurant.ejs', {
			result:createObj
		});
  });
});

	//update mongoDB
	app.post('/change', function(req, res) {
		var action="change";
		console.log("changing doc");
		console.log("1:"+req.body.creator);
		console.log("2"+req.session.username);
	
		var imageString="";
		if (req.files.ima){
		let image = req.files.ima;
		var imgName = new Date().getTime();
		var newPath = __dirname + "/img/" + imgName + ".png";
		imageString = imgName;
		console.log("newPath="+newPath);
		 image.mv(newPath, function(err) {
			 
			if (err)
			console.log(err)
			
			
   
		 
  });
		}else{
			
		db.collection('restaurant').find({_id:ObjectId(oid)},(err, restaurant) => {
		if (err) 	
			console.log(err);
		else
		console.log("old photo:"+restaurant.image);
		createObj.image=restaurant.image; 
		
		});
		}
		//working
		var oid = req.query._id;
		
		var createObj = {};	
		
		createObj.address={};
		createObj=req.body;	
		
		address={};
		address.street='';
		address.building='';
		address.zipcode=''
		
		createObj.address=address;
		createObj.creator = req.session.username;
		console.log("nothing:"+JSON.stringify(createObj));
		
		
		createObj.address.street =req.body.street;
		createObj.address.building=req.body.building;
		createObj.address.zipcode=req.body.zipcode;
		
		delete createObj.street;
		delete createObj.building;
		delete createObj.zipcode;
		
		/*var name =	req.query.name;	 
        var borough =req.query.borough;
		var cuisine =req.query.cuisine;
		var street =req.query.street;
		var building=req.query.building;
		var zipcode=req.query.zipcode;
		var lon=req.query.lon;
		var lat=req.query.lat;
		var image =req.query.image;*/
		delete req.body._id;
		//id = ObjectId('5a06cd31913d7c19e81aebce');
		console.log("oid="+oid);
		console.log("req.body="+JSON.stringify(req.body));
		console.log("change="+JSON.stringify(createObj));
		console.log("street:"+createObj.address.street);
		
        db.collection('restaurant').updateOne({_id:ObjectId(oid)},{$set :createObj},(err, result) => {
		if (err) 	
			console.log(err);
		else
		db.collection('restaurant').find({_id:ObjectId(oid)},(err, restaurant) => {
		if (err) 	
			console.log(err);
		else
		createObj._id= ObjectId(oid);
		
	   
        res.render('restaurant.ejs', {result:createObj,action:action});
				
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
//detail page
    	app.get('/display',isLoggedIn, function(req, res) {
			var message = null;
			var oid = req.query._id;
			console.log(req.session.username +"displaying doc");
			console.log(req.query);
			 db.collection('restaurant').findOne({_id:ObjectId(oid)},function(err,result){
					console.log(result);
				res.render('restaurant.ejs', {
					result :result ,
					message:message
  });
			});
		});
		
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
        });
    });*/
	
	//Register	
    app.post('/register',function(req,res){
		var username =req.body.username; //Requirement 1
		var password =req.body.password;
	});
    //LOGOUT
    app.get('/logout', function(req, res) {
		req.session =null;
       // req.logout();
        res.redirect('/');
    });
	
	//Rate
	app.post('/rate',isLoggedIn, function(req, res) {
		var oid = req.query._id;
		
		var action="rate";
		console.log(req.session.username +" passed to post rate ");
		var message="";
		var Toupdate=true;
		//for (var i in )
		var grade={};
		grade.username = req.session.username;
		grade.score = req.body.score;
		var session = req.session.username;
		db.collection('restaurant').findOne({_id:ObjectId(oid)},function(err,result){
		console.log(JSON.stringify(result));
		console.log(result.grade.length);
		console.log(result.grade[0]);
		console.log("session="+req.session.username);
		console.log(result.grade[0].username);
		if(result.grade.length!=0)
		for (var j=0 ; j<=result.grade.length;j++){
			var user = result.grade[j].username;
			console.log(user);
		       if (session == user){
				message ="You have rated this restaurant"
				Toupdate=false;
				break;
				}
		}
		    
		
		/*for(var i in result){
			console.log(result[i].grade);
			for (var j=0 ; j<=result[i].grade.length();j++){
				console.log("enter");
			}
		    
				
				
				/*if (req.session.username == result.grade[j].username)
					res.render('remove.ejs',{message:"You have rated this restaurant"});*/
			
		//}
	  if(Toupdate)
	  db.collection('restaurant').update({_id:ObjectId(oid)},{$push:{'grade':grade}},(err, result) => {
		if (err) 	
			console.log(err);
		else
		message="You have rated this restaurant"
		
		
  });
		res.render('remove.ejs',{message:message,action:action});
		}); 
    });
	
	app.get('/rate', isLoggedIn,function(req, res) {
	console.log(req.session.username +" passed to get rate ");
	var result=req.query._id;
        res.render('rate.ejs', {
			result:result
		});
    });

	
    // REGISTER
    app.get('/register', function(req, res) {
        res.render('register.ejs', {
          
        });
    });
	
	//Detail
	app.get('/detail',isLoggedIn, function(req, res) {
		var result=req.query._id;
		console.log(req.session.username +"showing doc");
        res.render('restaurant.ejs', {
			result:result
		});
    });
	//new page
	app.get('/new', isLoggedIn,function(req, res) {
		console.log(req.session.username +"creating doc");
        res.render('new.ejs', {
		});
    });
	
	//Delete
	app.get('/remove',isLoggedIn, function(req, res) {  //delete Requirement 
	  var oid = req.query._id;
	  var action="remove";
	    /*
		var criteria = {};
			for (key in req.query) {
				criteria[key] = req.query[key];
			}
	    MongoClient.connect(mongourl,function(err,db) {
		assert.equal(err,null);
		console.log('Connected to MongoDB\n');
		deleteRestaurant(db,criteria,function(result) {
			db.close();
			console.log(JSON.stringify(result));		
		  });
	    });*/
		console.log(req.session.username +"removing doc");
		console.log(req.session.username===req.body.creator);
		console.log("1:"+req.session.username);
		console.log("2:"+req.body.creator);
		 db.collection('restaurant').findOne({_id:ObjectId(oid)},function(err,result){
			 
	if(req.session.username != result.creator){
		res.render('remove.ejs', {message:"You are not the owner"});
	}else{
	
	db.collection('restaurant').remove({_id:ObjectId(oid)},(err, result) => {
		if (err) 	
			console.log(err);
		else{
		
		 res.render('remove.ejs', {message:"Delete was successful",action:action});
	} 
	});
	}
	});
  });
	
       
    
	//MAIN Page
	app.get('/read' ,isLoggedIn,function(req, res,next) {
	    console.log(req.session.username +"reading doc");
	    var criteria={};
		console.log(req.query);
		for (key in req.query) {
                		criteria[key] = req.query[key];				
        }
		var restaurant=[];
		var cursor=db.collection('restaurant').find(criteria);
		cursor.each(function(err,doc){  
		  if(doc!=null){
		    console.log(doc);
		    restaurant.push(doc);
		   }else{
		   
		     res.render('mainpage.ejs', {restaurant:restaurant,incriteria:criteria});//incriteria:criteria
			 //return next();
		   }
		});
	//detail page
	/*
	app.get('/display',isLoggedIn, function(req, res,next) {
	//console.log("display Got:"+ req.session.username);  //<< Cannot display
		var oid = req.query._id;
	  db.collection('restaurant').find({_id:ObjectId(oid)},(err, restaurant) => {
		if (err) 	
			console.log(err);
		else
		
		
  
        res.render('restaurant.ejs', {
				restaurant:restaurant*/
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
            /*});
		});
    });
});	*/



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

/*
function deleteRestaurant(db,criteria,callback) {
	db.collection('restaurants').deleteMany(criteria,function(err,result) {
		assert.equal(err,null);
		console.log("Delete was successfully");
		callback(result);
	});
}
*/
/*
app.listen(port, function () {
  console.log('App is listening on port ' + port);
 });
	});*/
			});
function isLoggedIn(req, res, next) {

    if (req.session.authenticated)
        return next();

    res.render('login.ejs');
}