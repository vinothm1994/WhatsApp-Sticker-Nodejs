var express = require('express');
var router = express.Router();
var fs = require('fs');

const dbConnection = require('../config/dbConnection');
const connection = dbConnection();

/* GET home page. */
router.get('/', function (req, res, next) {
    req.session.success11 = true;
    if (req.session.userId === undefined) {
        res.redirect('/login')

    } else {
        res.render('index', {title: 'Express'});

    }
});

router.post("/login", function (req, res, next) {
    var email = req.body.email;
    var password = req.body.password;
    if (email && password) {
        connection.query("SELECT * FROM user WHERE email= '" + email + "' AND password='" + password + "'", (error, result) => {
            if (result.length !== 0) {
                req.session.userId = result[0].id;
                res.redirect("/apps")
            } else {
                res.send("invalid password");
            }
            console.log(result);
        });
    } else {
        res.send("error");
    }
});


router.get("/login", function (req, res, next) {
    res.render("login");

});


router.get('/sticker/:id', (req, res) => {
    var filename = req.params.id;
    var img = fs.readFileSync('./uploads/121_2x.png');
    res.contentType('image/jpeg');
    res.send(img);
});

router.get('/sticker_pack/:id', (req, res) => {
    var filename = req.params.id;
    var img = fs.readFileSync('./uploads/121_2x.png');
    res.contentType('image/jpeg');
    res.send(img);
});


// get sticker_group
router.get('/apps/:appId/stickers', function (req, res, next) {
    let appId = req.params.appId;
    let baseUrl = req.protocol + "://" + req.headers.host;
    connection.query('SELECT sticker_group.id,sticker_group.name,sticker_group.download_count,sticker_group.image_path,sticker.id AS sticker_id ,sticker.file_name, sticker.file_url,sticker.size ' +
        'FROM ' +
        '`sticker_group`,`sticker` WHERE sticker_group.id=sticker.group_id',
        (err, result) => {
            console.log(err);
            if (err) {
                const error = new Error(err);
                error.httpStatusCode = 500;
                return next(error);
            }
            var stickerGroupswithId = {};
            result.forEach(function (item) {
                let group = stickerGroupswithId[item.id];
                if (group == null) {
                    let trayPath = baseUrl + item.image_path.replace('uploads', "");
                    group = {
                        id: item.id,
                        name: item.name,
                        download_count: item.download_count,
                        tray_image_url: trayPath,
                        size: 0,
                        stickers: []
                    };
                    stickerGroupswithId[item.id] = group;
                }
                var filePath = item.file_url.replace('uploads', "");
                group.size = group.size + item.size;
                var obj = {
                    file_name: item.file_name,
                    file_url: baseUrl + filePath,
                };
                group.stickers.push(obj);
            });
            var arr = [];
            for (element in stickerGroupswithId) {
                arr.push(stickerGroupswithId[element]);
            }
            res.status(200);
            res.json(arr);
        });
});



module.exports = router;
