const express = require('express');
const dbConnection = require('../config/dbConnection');
const connection = dbConnection();
const router = express.Router();

// get apps
router.get('/', function (req, res, next) {
    connection.query('SELECT * FROM app', (err, result) => {
        res.render("get_apps", {appDatas: result});

    });

});


// add apps page
router.get('/add', function (req, res, next) {
    res.render("add_app");
});

// create app
router.post('/add', function (req, res, next) {
    var name = req.body.name;
    console.log(name);
    connection.query('INSERT INTO app (id, name) VALUES (NULL, \'' + name + '\')', (err, result) => {
        console.log(err);
        console.log(result);
        res.redirect("/apps")

    });
});

// update
router.put('/', function (req, res, next) {
    res.send('put apps');
});


// delete
router.delete('/', function (req, res, next) {
    res.send('delete apps');
});

module.exports = router;


