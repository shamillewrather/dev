var express = require ('express');
var app = express();
var ejs = require('ejs');

// STATIC ROUTE
app.use('/static', express.static('static'));

// 404 ROUTE
app.use(function(req, res, next){
    res.status(404);
    res.render('404.ejs');
    console.error("an error 404 has taken place, my dear");
});

// SERVER LISTENING ON PORT 8080
app.listen(8080);