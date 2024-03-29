var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');


var indexRouter = require('./routes/index');
var notificationRouter = require('./routes/notification');

var usersRouter = require('./routes/users');
var stickerAppRouter = require('./routes/sticker_app');
var stickerGroupARouter = require('./routes/sticker_group');

var app = express();
var  session=require('express-session');
const FileStore = require('session-file-store')(session);
var  config=require('./config/config');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// for parsing application/json
app.use(bodyParser.json());
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({extended: true}));
app.use(logger('dev'));
app.use(cookieParser());
app.use(session({
    secret:config.sessionSecret,
    store: new FileStore(),
    saveUninitialized : false,
    resave : true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));
app.use('/', indexRouter);
app.use('/notification', notificationRouter);
app.use('/users', usersRouter);
app.use('/apps', stickerAppRouter);
stickerAppRouter.use('/:appId/group', stickerGroupARouter);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
