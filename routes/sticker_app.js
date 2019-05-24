const express = require('express');
const dbConnection = require('../config/dbConnection');
const connection = dbConnection();
const router = express.Router();
var multer = require('multer');


// get apps
router.get('/', function (req, res, next) {
    if (req.session.userId === undefined) {
        res.redirect('/login')
    } else {
        connection.query('SELECT * FROM app', (err, result) => {
            result.forEach(function (data) {
                if (data.image_path !== undefined) {
                    var filePath = data.image_path.replace('uploads', "");
                    console.log(filePath);
                    data.image_url = filePath;
                }
            });
            res.render("get_apps", {appDatas: result});

        });
    }

});


// create app

// get sticker_group
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        var name = file.originalname;
        var new_file = name.replace(/ /g, '+');
        callback(null, new_file);
    }
});

var stickerGroupUploader = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var fileType = ['png'];
        if (fileType.indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    },
    limits: {
        fieldNameSize: 100,
        files: 1,
        fields: 2,
        fileSize: 2 * 1024 * 1024
    }
}).single('image');


router.post('/add', stickerGroupUploader, function (req, res, next) {
    if (req.session.userId === undefined) {
        res.redirect('/login')

    } else {
        var name = req.body.name;
        const file = req.file;
        if (file === undefined) {
            const error = new Error('Please choose files');
            error.httpStatusCode = 400;
            return next(error);
        } else if (name === "") {
            const error = new Error('Please enter app name');
            error.httpStatusCode = 400;
            return next(error);
        } else {
            var filePath = file.path;
            connection.query('INSERT INTO app (id, name,image_path) VALUES (NULL, \'' + name + '\' ,\'' + filePath + '\')', (err, result) => {
                res.redirect("/apps")

            });
        }
    }
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


