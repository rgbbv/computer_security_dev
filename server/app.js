require('./common/db');

const bodyParser = require('body-parser');
const cors = require('cors');

const createError = require('http-errors');
let express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const boom = require('express-boom');
const passport = require("passport");

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(cors({ origin: 'http://localhost:4200' }));
app.use(boom());
app.use(passport.initialize());
require('./common/passport');

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

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
