   var express = require('express');
	var app = express();
	
module.exports = function(app) {
	
   app.get('/', function(req, res) {
        res.render('restaurant.ejs', {
		});
    });

    //LOGIN
   /*app.post('/create', function(req, res) {  //Requirement 1
        res.render('login.ejs', {
            name:req.name,
			password:req.password		
        });
    });
	 //CREATE
    app.post('/new', function(req, res) {  //Requirement 2
        res.render('mainpage.ejs', {
            name:req.name,
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
	

    //LOGOUT
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });

    // REGISTER
    app.get('/register', function(req, res) {
        res.render('register.ejs', {
          
        });
    });
}