const express = require('express');
const dbConnection = require('../config/dbConnection');
const connection = dbConnection();
const router = express.Router();
var admin = require("firebase-admin");


// create app
router.get('/', function (req, res, next) {
    if (req.session.userId === undefined) {
        res.redirect('/login')
    } else {
        connection.query('SELECT * FROM notification order by send_at DESC limit 100', (err, result) => {
            res.render("notifications", {appDatas: result});
        });
    }

});

// Send Notication
router.post('/send', function (req, res, next) {
    let userId = req.session.userId;
    if (userId === undefined) {
        res.redirect('/login')
    } else {
        var title = req.body.title;
        var body = req.body.body;
        if (title && body) {
            console.log(title);
            console.log(body);
            sendNotification(title, body, userId, res,next);
        }
    }

});

function sendNotification(title, body, userId, res,next) {

    var topic = "all";
    var message = {
        notification: {
            title: title,
            body: body
        },
        /* data: {
             event: body
         },*/
        topic: topic
    };
    admin.messaging().send(message)
        .then((response) => {
            // Response is a message ID string.
            connection.query('INSERT INTO `notification` (`id`, `title`, `body`, `fcm_message_id`, `send_at`,`send_by`) ' +
                'VALUES (NULL, \'' + title + '\', \'' + body + '\', \'' + response + '\', CURRENT_TIMESTAMP' + ',\'' + userId + '\'' + ')',
                (err, result) => {
                    console.log(err);
                    console.log(result);
                    res.redirect("/notification");
                });
        })
        .catch((error) => {
            error.httpStatusCode = 400;
            return next(error);
        });

}


module.exports = router;