var express = require('express');
var router = express.Router();
var fs = require('fs');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
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

const dbConnection = require('../config/dbConnection');
const connection = dbConnection();

// get sticker_group
router.get('/stickers', function (req, res, next) {
    let appId = req.params.appId;
    let groupId = req.params.id;
    console.log(appId);
    connection.query('SELECT sticker_group.id,sticker_group.name ,sticker.file_name, sticker.file_url,sticker.size ' +
        'FROM ' +
        '`sticker_group`,`sticker` WHERE sticker_group.id=sticker.group_id',
        (err, result) => {
            var datas = {};
            result.forEach(function (item) {
                let datum = datas[item.id];
                if (datum == null) {
                    datum = {
                        id: item.id,
                        name: item.name,
                        sticker: []
                    };
                    datas[item.id] = datum;
                }
                var obj = {
                    file_name: item.file_name,
                    file_url: item.file_url,

                };
                datum.sticker.push(obj);
            });



            res.send(datas);


        });
});


module.exports = router;
