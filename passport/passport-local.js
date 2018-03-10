'use strict';

const passport = require("passport");
const User = require("../models/user");
const LocalStrategy = require("passport-local").Strategy;

passport.serializeUser((user, next) => {
    next(null, user.id);
});


passport.deserializeUser((id, next) => {
   User.findById(id, (err, user) => {
       if(err) {
           console.log(err.message);
       } else {
           next(err, user);
       }
   }); 
});

//SIGNUP

passport.use('local-signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, (req, email, password, next) => {
    
    User.findOne( {'email': email }, (err, user) => {
        if(err) 
           return console.log(err.message);
           
         if(user)
           return next(null, false, req.flash('error', 'User with that email already exist'));
        
        
        const newUser = new User();
        newUser.username = req.body.username;
        newUser.email = req.body.email;
        newUser.fullname = req.body.username;
        newUser.password = newUser. encryptPassword(req.body.password);
        
        newUser.save((err, createdUser) => {
            if(err) {
                console.log(err.message);
            } else {
                console.log(createdUser);
                return next(null, createdUser);
            }
        });
    });
    
}));


//login

/* Sign in using Email and Password */
passport.use('local-login', new LocalStrategy({
  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
}, function(req, email, password, done) { // callback with email and password from our form

  // find a user whose email is the same as the forms email
  // we are checking to see if the user trying to login already exists
  User.findOne({ email:  email }, function(err, user) {
    // if there are any errors, return the error before anything else
    if (err){
    return done(err);
}
    // if no user is found, return the message
    const messages = [];
    // if the user is found but the password is wrong
    if (!user || !user.validUserPassword(password)){
    messages.push('Oops! Wrong password.');
    return done(null, false, req.flash('error', messages )); // create the loginMessage and save it to session as flashdata
}
    // all is well, return successful user
    return done(null, user);
  });

}));
