   var express = require('express');
	var app = express();
	
module.exports = function(app) {
	
   app.get('/', function(req, res) {
        res.render('login.ejs', {
		});
    });
	 app.get('/create', function(req, res) { 
	  res.render('create.ejs', {
		});
    });
	
    //Create
   app.post('/create', function(req, res) { 
		var name =	req.body.borough;	 
        var borough =req.body.borough;
		var cuisine =req.body.borough;
		var street =req.body.borough;
		var building=req.body.borough;
		var zipcode=req.body.borough;
		var lon=req.body.borough;
		var lat=req.body.borough;
		var image =req.body.borough;
		
		/*To-DO insert data to mongodb*/ 
        /*res.render('login.ejs', {
            name:req.name,
			password:req.password		
        });*/
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
        });
    });*/
	
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
	app.get('/mainpage', function(req, res) {
        res.render('mainpage.ejs', {
		});
    });
}