var express = require('express');
var app = express();
var url = require('url');
var ejs = require('ejs');
var querystring = require('querystring');
var mysql = require('mysql');

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



// ROUTE FORM MODIFICATION CARTE
app.get('/:nom_utilisateur/modification/:id_carte', function(req, res) {

    res.setHeader('Content-Type', 'text/html');
    var id_carte = req.params.id_carte;
    var utilisateur = req.params.nom_utilisateur;

    var connection = mysql.createConnection({
        host     : '51.75.6.71',
        user     : 'prf',
        password : 'prf123',
        database : 'prf'
    });

    connection.connect();

    var sql = "SELECT * FROM cartes WHERE id=" + id_carte;

    console.log(sql);

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        var question = results[0].question;
        var response = results[0].reponse;

        res.render('modification.ejs', {
            utilisateur: utilisateur,
            id_carte : id_carte,
            question : question,
            reponse : response
        });
    });

    connection.end();

});


// ROUTE CONFIRM MODIFICATION CARTE
app.get('/:nom_utilisateur/confirm_modification/:id_carte', function(req, res) {

    res.setHeader('Content-Type', 'text/html');

    var params = querystring.parse(url.parse(req.url).query);

    var id_carte = req.params.id_carte;
    var utilisateur = req.params.nom_utilisateur;
    var question = params['question'].replace("'","\\'");
    var reponse = params['reponse'].replace("'","\\'");

    var connection = mysql.createConnection({
        host     : '51.75.6.71',
        user     : 'prf',
        password : 'prf123',
        database : 'prf'
    });

    connection.connect();

    var sql = "UPDATE cartes SET question='" + question + "', reponse='" + reponse + "' WHERE id=" + id_carte;

    console.log(sql);

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;

        res.render('modified.ejs', {
            utilisateur: utilisateur,
            id_carte : id_carte
        });
    });

    connection.end();

});


// ROUTE RESULTAT
app.get('/:nom_utilisateur/result.html', function(req, res) {

    res.setHeader('Content-Type', 'text/html');

    var params = querystring.parse(url.parse(req.url).query);

    if ('question' in params && 'reponse' in params) {

        if(params['question'] === "" || params['reponse'] === "") {
            res.send("Il faut remplir TOUT le formulaire");
        } else {

            var question = params['question'].replace("'","\\'");
            var reponse = params['reponse'].replace("'","\\'");
            var utilisateur = req.params.nom_utilisateur;

            var connection = mysql.createConnection({
                host     : '51.75.6.71',
                user     : 'prf',
                password : 'prf123',
                database : 'prf'
            });

            connection.connect();

            // INSERTION
            // INSERT INTO cartes SET question='ceci est ma question', reponse='Ceci est ma reponse', status=9;
            // SELECT * FROM cartes WHERE status =! 9;
            // UPDATE cartes SET reponse='Blanc' WHERE question='ceci est ma question';
            // DELETE FROM cartes WHERE id=1;

            var sql = "INSERT INTO cartes SET question='" + question + "', reponse='" + reponse + "', utilisateur='" + utilisateur + "'";

            console.log(sql);

            connection.query(sql, function (error, results, fields) {
                if (error) throw error;
                res.render('result.ejs', { utilisateur: req.params.nom_utilisateur });
                console.log("Carte ajoutée, cooool");
            });

            connection.end();

        }
    }
    else {
        res.send("Données incorrectes");
    }
});








// ROUTE LISTE UTILISATEUR
app.get('/:nom_utilisateur/liste.html', function(req, res) {

    res.setHeader('Content-Type', 'text/html');

    var utilisateur = req.params.nom_utilisateur;

    var connection = mysql.createConnection({
        host     : '51.75.6.71',
        user     : 'prf',
        password : 'prf123',
        database : 'prf'
    });

    connection.connect();

    var sql = "SELECT * FROM cartes WHERE utilisateur='" + utilisateur + "'";

    console.log(sql);

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log("Liste des cartes", utilisateur, results);
        res.render('liste.ejs', {
            utilisateur : utilisateur,
            cartes : results
        });
    });

    connection.end();

});


// ROUTE SUPPRIME CARTE UTILISATEUR
app.get('/:nom_utilisateur/delete/:id_carte', function (req, res) {

    res.setHeader('Content-Type', 'text/html');

    var utilisateur = req.params.nom_utilisateur;
    var id_carte = req.params.id_carte;

    var connection = mysql.createConnection({
        host: '51.75.6.71',
        user: 'prf',
        password: 'prf123',
        database: 'prf'
    });

    connection.connect();

    var sql = "DELETE FROM cartes WHERE utilisateur='" + utilisateur + "' AND id='" + id_carte + "'";
    // var sql = "SELECT * FROM cartes";

    console.log(sql);

    connection.query(sql, function (error, results, fields) {
        if (error) throw error;
        console.log("Cartes " + id_carte + " supprimée !!!!", results);
        res.render('delete.ejs', {
            utilisateur: utilisateur,
            id_carte: id_carte
        });
    });
});



// ROUTE 404
app.use(function(req, res, next){
    res.status(404);
    res.render('404.ejs');
    console.error("Une erreur 404 a été retournée");
});



// ON ECOUTE LE PORT 8080 (ou 8081)
app.listen(8080);
