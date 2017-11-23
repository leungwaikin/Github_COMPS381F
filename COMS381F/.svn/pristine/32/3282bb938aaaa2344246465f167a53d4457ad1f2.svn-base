   var express = require('express');
   var app = express();
   
module.exports = function(app, passport, MongoClient) {	
//login
   app.get('/', function(req, res) {
        res.render('login.ejs', {
		});
    });

//Google Map
   app.get("/gmap",function (req,res)
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
		console.log("route="+got_id);
		var restaurant=[];
		var cursor=db.collection('restaurant').find({_id: ObjectId(got_id)});
		cursor.each(function(err,doc){  
		  if(doc!=null){
		    console.log(doc);
		    restaurant.push(doc);
		   }else{
		     res.render('change.ejs', {result:restaurant});
		   }
		});
		
	
   });
	
	
    //Create
   app.post('/new', function(req, res) { 
   
   var imageString ="";
   console.log(req.files.ima);
      
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
	
		var createObj = {};		
		createObj=req.body;		
		createObj.grade=[];		
		createObj.address={};
		createObj.image=imageString; 
		
		//if(req.body.street||req.body.building||req.body.zipcode){
		createObj.address.street=req.body.street;
		createObj.address.building=req.body.building;
		createObj.address.zipcode=req.body.zipcode;
		 //}
		 delete createObj.street;
		 delete createObj.building;
		 delete createObj.zipcode;


		console.log("createObj="+JSON.stringify(createObj));
			
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
		console.log("changing doc");
		var imageString="";
		if (req.files.ima){
		let image = req.files.ima;
		var imgName = new Date().getTime();
		var newPath = __dirname + "/img/" + imgName + ".png";
		imageString = imgName;
		console.log("newPath="+newPath);
		 image.mv(newPath, function(err) {
			 
			if (err)
			console.log(err);
			
			
   
		 
  });
		}
		var oid = req.query._id;
		var createObj = {};		
		createObj=req.body;	
		createObj.image=imageString; 
		
		delete req.body._id;
	
		console.log("oid="+oid);
		console.log("req.body="+req.body);
		
        db.collection('restaurant').updateOne({_id:ObjectId(oid)},{$set :createObj},(err, result) => {
		if (err) 	
			console.log(err);
		else
		
		res.send("updated successfully");
  });
    });

    	app.get('/display', function(req, res) {
			var oid = req.query._id;
			console.log(req.query);
			 db.collection('restaurant').findOne({_id:ObjectId(oid)},function(err,result){
					console.log(result);
				res.render('restaurant.ejs', {
					result :result 
  });
			});
		});
		
	
	//Register	
    app.post('/register',function(req,res){
		var username =req.body.username; //Requirement 1
		var password =req.body.password;
	});
    //LOGOUT
    app.get('/logout', function(req, res) {
       // req.logout();
        res.redirect('/');
    });
	
	//Rate
	app.post('/rate', function(req, res) {
		var oid = req.query._id;
		var grade={};
		grade.username = "Mary";
		grade.score = req.body.score;
	  db.collection('restaurant').update({_id:ObjectId(oid)},{$push:{'grade':grade}},(err, result) => {
		if (err) 	
			console.log(err);
		else
		
		res.send('rated successfully');
  });
        
    });
	
	app.get('/rate', function(req, res) {
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
	app.get('/detail', function(req, res) {
		var result=req.query._id;
        res.render('restaurant.ejs', {
			result:result
		});
    });
	//new page
	app.get('/new', function(req, res) {
        res.render('new.ejs', {
		});
    });
	
	//Delete
	app.get('/remove', function(req, res) {  //delete Requirement 
	  var oid = req.query._id;
	  
	
	db.collection('restaurant').remove({_id:ObjectId(oid)},(err, result) => {
		if (err) 	
			console.log(err);
		else
		
		 res.render('remove.ejs', {messsge:"Delete was successful"});
  });
	
       
    });
	//MAIN Page
	app.get('/read', function(req, res) {
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
		   }
		});
	//detail page
	
	app.get('/display', function(req, res) {
		var oid = req.query._id;
	  db.collection('restaurant').find({_id:ObjectId(oid)},(err, restaurant) => {
		if (err) 	
			console.log(err);
		else
		
		
  
        res.render('restaurant.ejs', {
				restaurant:restaurant
		  
            });
		});
    });
});	

}
