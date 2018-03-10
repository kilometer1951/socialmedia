'use strict';

module.exports = function(_, passport, User){
    
    return {
        setRouting: function(router){
          router.get("/", this.indexPage);  
          router.get("/signup", this.getSignup);
         
          router.get('/login', this.loginPage);
          
          
          
          router.get('/auth/facebook', this.getFacebookSignup);
	 	  router.get('/auth/facebook/callback', this.Facebookcallback);
	 	  router.get('/auth/google', this.getGoogleSignup);
	 	  router.get('/auth/google/callback', this.Googlecallback);
          router.post('/signup', User.SignupValidation, this.postSignup);
          router.post('/login', User.LoginValidation, this.postLogin);
          
        },
        
        indexPage: function(req, res){
            return res.render('index', {test: 'this'});
        },
        
        
        getSignup: function(req, res){
            const errors = req.flash('error');
            if (!req.user){
              return res.render('signup', 
	 			{ 
	 				title: 'FootbalKik | Signup', 
	 				messages: errors,
	 			    hasErrors: errors.length > 0
	 			});
            }else{
            	res.redirect("/home");
            }
        },
        loginPage: function(req, res){
            const errors = req.flash('error');
            return res.render('login', 
	 			{ 
	 				title: 'FootbalKik | Signup', 
	 				messages: errors,
	 			    hasErrors: errors.length > 0
	 			});
        },
        
        
        postSignup: passport.authenticate('local-signup', {
                       successRedirect: '/home',
                       failureRedirect: '/signup',
                       failureFlash: true
           
        }),
        postLogin: passport.authenticate('local-login', {
				    successRedirect : '/home', // redirect to the secure profile section
				    failureRedirect : '/login', // redirect back to the signup page if there is an error
				    failureFlash : true // allow flash messages
        }),
        
        getFacebookSignup: passport.authenticate('facebook', {
				    scope: 'email'
				  }),

	 	Facebookcallback: passport.authenticate('facebook', {
				    successRedirect : '/home', // redirect to the secure profile section
				    failureRedirect : '/', // redirect back to the signup page if there is an error
				    failureFlash : true // allow flash messages
				  }),

	 	getGoogleSignup: passport.authenticate('google', {
				    scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/plus.profile.emails.read']
				  }),

	 	Googlecallback: passport.authenticate('google', {
				    successRedirect : '/home', // redirect to the secure profile section
				    failureRedirect : '/', // redirect back to the signup page if there is an error
				    failureFlash : true // allow flash messages
				  })
        
        
    }
} 
