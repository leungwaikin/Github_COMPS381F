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
	{name: 'guest', password: 'guest'},
	{name: 'demo'}
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
		if(req.body.username=="demo"&&users[i].name == req.body.username ){
			req.session.authenticated = true;
			req.session.username = users[i].name;
			console.log("Got:1"+ req.session.username);
			res.redirect('/read');
			return next()
		}
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
			console.log("*****************AAA");
			var action = "Warning";
			var message = "you are not the owner";
			res.render('remove.ejs',{message: message, action: action});
		}else{
			console.log("*****************BBB");
			var restaurant=[];
			var cursor=db.collection('restaurant').find({_id: ObjectId(got_id)});
			cursor.each(function(err,doc){  
			  if(doc!=null){

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
		
		var image=req.files.image; 
		var createObj = {};		
		createObj=req.body;		
		createObj.grade=[];		
		createObj.address={};
		createObj.address.coord=[];
		createObj.creator= req.session.username;
		createObj.address.street=req.body.street;
		createObj.address.building=req.body.building;
		createObj.address.zipcode=req.body.zipcode;
		createObj.address.coord[0]=req.body.lon;
		createObj.address.coord[1]=req.body.lat;
		if(image){
		createObj.photo=new Buffer(image.data).toString('base64');
		createObj.photoMimetype=image.mimetype;
		}
		 delete createObj.lat;
		 delete createObj.lon;
		 delete createObj.street;
		 delete createObj.building;
		 delete createObj.zipcode;
		

		
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
		var createObj = {};	
		console.log(req.body);
		console.log("changing doc");
		console.log("1:"+req.body.creator);
		console.log("2"+req.session.username);

		var image  = req.files.image;
		
		

		//working
		var oid = req.query._id;
		createObj.address={};
		createObj=req.body;	
		
		address={};
		address.street='';
		address.building='';
		address.zipcode=''
		address.coord=[];
		
		
		createObj.address=address;
		createObj.creator = req.session.username;
		console.log("nothing:"+JSON.stringify(createObj));

		
		if (image){
	console.log("**************************************************************");
		console.log("access");
		createObj.photo=new Buffer(image.data).toString('base64');
		createObj.photoMimetype=image.mimetype;
   
		 
		}
		else{
				console.log("-----------------------------------------------");
		createObj.photo=req.body.oldPhoto;
		createObj.photoMimetype=req.body.oldPhotoMimetype;

		}
		createObj.address.street =req.body.street;
		createObj.address.building=req.body.building;
		createObj.address.zipcode=req.body.zipcode;
		createObj.address.coord[0]=req.body.lon;
		createObj.address.coord[1]=req.body.lat;
		
		delete createObj.lat;
		delete createObj.lon;
		delete createObj.street;
		delete createObj.building;
		delete createObj.zipcode;
		
		delete createObj.oldPhoto;
		delete createObj.oldPhotoMimetype;
		
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
		
	   
        res.render('restaurant.ejs',{result:createObj,action:action});
				
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
			coord=[req.lon,req.lat]
        });
    });*/
	
	//Register	
    app.post('/register',function(req,res){
		var name =req.body.username; //Requirement 1
		var password =req.body.password;
		var createObj ={};
		var createUser = true; 
		createObj.name=name;
		createObj.password=password;
		console.log('1'+name);
		console.log(password);
		for(var i =0 ;i<users.length;i++){
			if(users[i].name==name&&users[i].password==password){
				createUser = false; 
				break;
			}
		}
			if(createUser){
			users.push(createObj);
			req.session.authenticated = true;
			req.session.username = name;
			console.log("Got:"+ req.session.username);
			console.log(users);
			res.redirect('/read');
			//return next()  <<useless?
		
		}
		
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
		//console.log(result.grade[0].username);
		console.log("Test 1");
		if(result.grade.length!=0){
			console.log("Test 2");
		for (var j=0 ; j<=result.grade.length-1;j++){
			console.log("Test 4");
			var user = result.grade[j].username;
			console.log(user);
		       if (session == user){
				   console.log("Test 5");
				message ="You have rated this restaurant"
				Toupdate=false;
				break;
				}
		}
		}
		    console.log("Test 6");
		
		/*for(var i in result){
			console.log(result[i].grade);
			for (var j=0 ; j<=result[i].grade.length();j++){
				console.log("enter");
			}
		    
				
				
				/*if (req.session.username == result.grade[j].username)
					res.render('remove.ejs',{message:"You have rated this restaurant"});*/
			
		//}
	  if(Toupdate){
	  db.collection('restaurant').update({_id:ObjectId(oid)},{$push:{'grade':grade}},(err, result) => {
		if (err) 	
			console.log(err);
		
		
		
  });
  message= "rated successfully";
  }
  
		res.render('remove.ejs',{message:message});
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
	
	// 
	app.get('/remove',isLoggedIn, function(req, res) {  //delete Requirement 
	  var oid = req.query._id;
	  var action="Remove";
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
		res.render('remove.ejs', {message:"You are not the owner",action:action});
	}else{
	
	db.collection('restaurant').remove({_id:ObjectId(oid)},(err, result) => {
		if (err) 	
			console.log(err);
		else{
		
		 res.render('remove.ejs', {message:"Delete was successful", action:action});
	} 
	});
	}
	});
  });
	
       //*** API POST restaurant Create
	/*app.post('/api/create',isLoggedIn, function(req, res) {  //delete Requirement 
	  //var oid = req.query._id;
	  var action="INFO";
	    
		//console.log("*********** AAA ");
		
		 res.render('remove.ejs', {message:"API POst request successful", action:action});
	
  });	   
	   
	          //*** API GET restaurant Read
	app.get('/api/read',isLoggedIn, function(req, res) {  //delete Requirement 
	  //var oid = req.query._id;
	  var action="INFO";
	    console.log("X Value "   + req.query.X);
		console.log("*********** AAA ");
		
		 res.render('remove.ejs', {message:"API REad request successful", action:action});
	
  });	 */

  app.post('/api/restaurant/create', function(req, res) { 
	  var criteria={};
	  
	
	  for (key in req.query){
		  
		  criteria[key]=req.query[key];
		  
	  }
	  console.log("criteria="+JSON.stringify(criteria));
	    db.collection('restaurant').insert(criteria,(err, restaurant) => {
			console.log("restaurant="+restaurant._id);
		if (err) {
                response = {
                    "status": false,                 
                };
            } else {
                response = {
                    "status": "ok",
                    "_id": req.query._id
                };
            }
            
		
		 res.json(response);
		});
  });	   
  
 app.get('/api/restaurant/read/:searchBy/:condition', function(req, res) {  
	  //var oid = req.query._id;
	  var searchBy= req.params.searchBy;
	  var condition = req.params.condition;
	  var criteria={};
		 criteria[searchBy]=condition;
		
		
		var restaurant=[];
		 console.log("criteria="+JSON.stringify(criteria));
		 
		 var cursor=db.collection('restaurant').find(criteria);
		 cursor.each(function(err,doc){  
		
		  if(doc!=null){
		    console.log(doc);
		    restaurant.push(doc);
		   }else{
			   res.json(restaurant);
		   }
		});
		
		
	
		
	
  });	
  
  app.delete('/delete',function(req,res){
		
		db.collection('restaurant').remove({});
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
	});
	app.get('/filter',isLoggedIn,function(req,res,next){
		 console.log(req.session.username +"searching doc");
		 var criteria={};
		 console.log(req.query.searchBy);
		
		
		 
		if(req.query.searchBy=="street"||req.query.searchBy=="building"||req.query.searchBy=="zipcode"||req.query.searchBy=="coord"){
			
			var searchBy=req.query.searchBy;
			if(searchBy=="coord"){
				var coord = req.query.condition.split(',');
				criteria["address."+req.query.searchBy]=coord;
			}else{
				criteria['address.'+searchBy]=req.query.condition;
			}
		}else{
		 criteria[req.query.searchBy]=req.query.condition;
		}
		  if(req.query.searchBy=="coord"){
			 
			
			 
			 
		 }
		
		
		 console.log("criteria="+JSON.stringify(criteria));
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
	

			
function isLoggedIn(req, res, next) {

    if (req.session.authenticated)
        return next();

    res.render('login.ejs');
}