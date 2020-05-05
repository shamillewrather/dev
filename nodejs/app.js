var express = require('express');
var app = express();
var url = require('url');
var ejs = require('ejs');
var querystring = require('querystring');
var fs = require('fs');


// ROUTE HOME
app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.render('home.ejs');
});


// ROUTE STATIC
app.use('/static', express.static('static'));


// ROUTE FORM UTILISATEUR
app.get('/:nom_utilisateur/form.html', function(req, res) {

    res.setHeader('Content-Type', 'text/html');
    res.render('form.ejs', {
        utilisateur : req.params.nom_utilisateur,
        patate : "Frite"
    });

});

// ROUTE RESULTAT
app.get('/:nom_utilisateur/result.html', function(req, res) {

    res.setHeader('Content-Type', 'text/html');

    var params = querystring.parse(url.parse(req.url).query);

    if ('question' in params && 'reponse' in params) {

        if(params['question'] === "" || params['reponse'] === "") {
            res.send("Il faut remplir TOUT le formulaire");
        } else {

            var maCarte = {
                "question": params['question'],
                "reponse": params['reponse']
            };

            console.log(maCarte);

            var maCarteJson = JSON.stringify(maCarte);

            var path = "data/" + req.params.nom_utilisateur + ".json";

            fs.writeFile(path, maCarteJson, function(err) {

                if(err) {
                    res.send("Désolé une erreur est survenue...");
                    console.error(err);
                    throw error;
                } else {
                    res.render('result.ejs', { utilisateur: req.params.nom_utilisateur });
                    console.log("J'ai écrit ce pu... de fichier avec succès !!!");
                }
            });

        }
    }
    else {
        res.send("Données incorrectes");
    }
});


// ROUTE 404
app.use(function(req, res, next){
    res.status(404);
    res.render('404.ejs');
    console.error("Une erreur 404 a été retournée");
});


// ON ECOUTE LE PORT 8080 (ou 8081)
app.listen(8080);