'use strict';

const passport = require('passport');
const User = require('../models/user');
const FacebookStrategy = require('passport-facebook').Strategy;
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
passport.use( new FacebookStrategy({
   clientID: secret.facebook.clientID,
   clientSecret: secret.facebook.clientSecret,
   profileFields: ['id', 'displayName', 'email'],
   callbackURL: 'http://localhost:3000/auth/facebook/callback',
   passReqToCallback: true

}, function(req, token, refreshToken, profile, done) { // callback with email and password from our form

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  User.findOne({ email: profile._json.email }, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err)
    return done(err);

   
    if (user){
       //authenticate the user
       return done(err, user);

    }else{

        var newUser = new User();
        newUser.facebook = profile.id;
        newUser.fullname = profile.displayName;
        newUser.email = profile._json.email;
        newUser.username = profile.displayName;
        newUser.userImage = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
        newUser.fbTokens.push({ token: token });
        newUser.save(function(err) {
          // all is well, return successful user
          return done(null, newUser);
        });
    }
    
	 
  });

}));



