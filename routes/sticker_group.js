const express = require('express');
const dbConnection = require('../config/dbConnection');
const connection = dbConnection();
var multer = require('multer');
var fs = require('fs');

const router = express.Router({mergeParams: true});

// get apps
router.get('/', function (req, res, next) {
    let appId = req.params.appId;
    console.log(appId);
    connection.query('SELECT * FROM sticker_group', (err, result) => {
        res.render("get_sticker_groups", {appId: appId, appDatas: result});
    });
});
// add apps page
router.get('/add', function (req, res, next) {
    let appId = req.params.appId;
    res.render("add_sticker_group", {id: appId});
});



// get sticker_group
router.get('/:id', function (req, res, next) {
    let appId = req.params.appId;
    let groupId = req.params.id;
    console.log(appId);
    connection.query('SELECT * FROM sticker', (err, result) => {
        result.forEach(function (data) {
            var filePath=data.file_url.replace('uploads',"");
            console.log(filePath);
            data.file_url=filePath;
        });
        res.render("sticker_group", {appId: appId, groupId: groupId, appDatas: result});
    });
});


// get sticker_group
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './uploads');
    },
    filename: function (req, file, callback) {
        var name=file.originalname;
        var  new_file=name.replace(/ /g, '+');
        callback(null, new_file);
    }
});
var upload = multer({
    storage: storage,
    fileFilter: function (req, file, callback) {
        var fileType = ['png', "jpg"];
        if (fileType.indexOf(file.originalname.split('.')[file.originalname.split('.').length - 1]) === -1) {
            return callback(new Error('Wrong extension type'));
        }
        callback(null, true);
    },
    limits: {
        fieldNameSize: 10,
        files: 10,
        fields: 2,
        fileSize: 10 * 10 * 1024 * 1024
    }
}).array('image', 10);

var path = require('path');

router.post('/:id/upload_image', upload, function (req, res, next) {
    let appId = req.params.appId;
    let groupId = req.params.id;
    console.log(appId);
    const files = req.files;
    if (!files) {
        const error = new Error('Please choose files');
        error.httpStatusCode = 400;
        return next(error);
    } else {
        files.forEach(function (file) {
            var filePath = file.path;
            var filename = path.basename(filePath);
            var fileSize=getFilesizeInBytes(filePath);
            console.log(filename);
            connection.query("INSERT INTO `sticker` (`id`, `file_name`, `file_url`, `size`, `group_id`) VALUES (NULL, '"+filename+"', '"+filePath+"', '"+fileSize+"', '"+groupId+"')", (err, result) => {
            });
        });
        res.redirect("/apps/" + appId + "/group/" + groupId);

    }
});

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    return stats["size"];
}


// get apps
router.get('/:id/add_sticker', function (req, res, next) {
    let appId = req.params.id;
    console.log(appId);
    res.send('tod');
});

// create app
router.post('/add', function (req, res, next) {
    let appId = req.params.appId;
    var name = req.body.name;
    console.log(name);
    connection.query('INSERT INTO sticker_group (id,app_id, name) VALUES (NULL, \'' + appId + '\' ,\'' + name + '\')', (err, result) => {
        console.log(err);
        console.log(result);
        res.redirect("/apps/" + appId + "/group");

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


