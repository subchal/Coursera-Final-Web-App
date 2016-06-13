var express           = require('express'),
    cfenv             = require('cfenv'),
    logger            = require('morgan'),
    bodyParser        = require('body-parser'),
    cookieParser      = require('cookie-parser'),
    mongoose          = require('mongoose'),
    passport          = require('passport'),
    authenticate      = require('./authenticate'),
    cors               = require('cors');


config = require('./config');

mongoose.connect(config.mongoUrl);
// mongoose.connect('mongodb://localhost:27017/conFusion');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("We're connected!");
});



var corsOptions = {
  origin: 'http://localhost:8001//'
};


var users = require('./server/routes/users');
var presets = require('./server/routes/presets');

var app = express();
var appEnv = cfenv.getAppEnv();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(passport.initialize());


//Static Files
app.use('/scripts', express.static(__dirname + '/app/scripts'));
app.use('/views', express.static(__dirname + '/app/views'));
app.use('/styles', express.static(__dirname + '/app/styles'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));

//Routes
app.get('/', cors(), function (req, res) {
  res.sendfile(__dirname + '/app/index.html');
});
app.use('/api/presets', cors(), presets);
app.use('/api/users', cors(), users);

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
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});

// app.listen(3000, function() {
//   console.log('Listening On Port 3000...');
// });

//Bluemix spec
app.listen(appEnv.port, '0.0.0.0', function() {
  console.log("server starting on " + appEnv.url);
});
