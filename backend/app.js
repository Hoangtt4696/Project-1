var express = require('express');
var path = require('path');
require('./config/init')();
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var checkJWT = require('./middleware/check-jwt');
var rabbitconnected = require('./lib/rabbit/connect');


var initRouteModule = require('./route');
var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public/build')));
app.use('/*', function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', '*');
  res.header('Access-Control-Allow-Headers', 'accesstoken,content-type');
  req.connection.setTimeout( 1000 * 60 * 10 ); 
  next();
});
app.use(checkJWT);
initRouteModule(app);
rabbitconnected();
// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


module.exports = app;
