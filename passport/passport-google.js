'use strict';

const passport = require('passport');
const User = require('../models/user');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const secret = require('../secret/secretFile');


passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});



/* Sign in using Email and Password */
passport.use( new GoogleStrategy({
   clientID: secret.google.clientID,
   clientSecret: secret.google.clientSecret,
   callbackURL: 'https://webdevbootcamp-kilometer.c9users.io/auth/google/callback',
   passReqToCallback: true

}, function(req, accessToken, refreshToken, profile, done) { // callback with email and password from our form

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  User.findOne({ email: profile.emails[0].value }, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err){
    return done(err);
  }

   
    if (user){
       //authenticate the user
       return done(null, user);

    }else{

        var newUser = new User();
        newUser.google = profile.id;
        newUser.fullname = profile.displayName;
        newUser.email = profile.emails[0].value;
        newUser.username = profile.displayName;
        newUser.userImage = profile._json.image.url;
        newUser.save(function(err) {
          // all is well, return successful user
          if (err) {
            return done(err);
          }else{
            return done(null, newUser);
          }
        });
    }
    
	 
  });

}));



