const express = require('express');
const app = express();
const session = require('express-session');
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = '59333616719-t471v43rg8gkhrd7bouh3p24hl44b8sd.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = 'BEn5a94H9fju04Vnu15zchj9';

var userProfile;

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET' 
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', function(req, res) {
  res.render('pages/auth');
});
app.get('/success', (req, res) => res.send(userProfile));
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
passport.deserializeUser(function(obj, cb) {
cb(null, obj);
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});


/*  Google AUTH  */
passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8000/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));
 
app.get('/auth/google', 
  passport.authenticate('google', { scope : ['profile', 'email'] }));
 
app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
});







