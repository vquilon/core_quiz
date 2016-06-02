var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var partials = require('express-partials');
var flash = require('express-flash');
var methodOverride = require('method-override');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));//cambiado a true en el tema 12
app.use(cookieParser());
app.use(session({secret: "Quiz 2016",
                  resave:false,
                  saveUninitialized: true}));
app.use(methodOverride('_method',{methods:["POST","GET"]}));
app.use(express.static(path.join(__dirname, 'public')));

app.use(partials());
app.use(flash());

//Helper dinamico
app.use(function(req, res, next){
  //Hacer visible req.session en las vistas
  res.locals.session = req.session;
  next();
});

app.use(function(req, res, next){
  //Verificar si ha expirado el tiempo de sesion
  if(req.session.user){//Hay sesion
    console.log("****************Hay usuario*****************");
    //console.log(req.session.user);
    var datems=new Date().getTime();
    var diftime=datems-req.session.user.expiredAt;
    console.log(diftime);
     if(diftime>=120000){//MAS DE DOS MINUTOS
      console.log("****************Logout mas de dos minutos*****************");
      delete req.session.user;//eliminar sesion
      res.redirect('/session?redir='+(req.param('redir') || req.url));//redirect a login
    }else{
      req.session.user.expiredAt=datems;//actualizar tiempo sesion
    }
  }
  next();
});





app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});



module.exports = app;
