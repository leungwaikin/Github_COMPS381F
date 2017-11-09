   var express = require('express');
	var app = express();
	
module.exports = function(app) {
	
   app.get('/', function(req, res) {
        res.render('restaurant.ejs', {
		});
    });



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