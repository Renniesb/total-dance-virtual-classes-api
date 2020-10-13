require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var apiRouter = require('./routes/api');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
const {CLIENT_ORIGIN} = require('./config');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');
const config = require('./config');
var indexRouter = require('./routes/index');
const authRouter = require('./auth/auth-router');
const secureRoutes = require('./routes/secure-routes');
const passport = require('passport');

var app = express();
//Devine a JWT Strategy for authentication
const JWTstrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

//define how we will extract the JWT
passport.use(new JWTstrategy({
    secretOrKey: config.JWT_SECRET,
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken()
    }, 

    async (authToken, done)=>{
      try {
        return done(null, authToken);
      } catch (error) {
        done(error);
      }
    }
  )
);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger((NODE_ENV === 'production') ? 'tiny' : 'common'));
app.use(cors({
  origin: CLIENT_ORIGIN
}));
app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/api', apiRouter);
app.use('/api/auth', authRouter);
app.use('/api/user',passport.authenticate('jwt', {session: false}), secureRoutes);
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
