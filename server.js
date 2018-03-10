const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const http = require("http");
const cookieParser = require("cookie-parser");
const validator = require("express-validator");
const session =  require("express-session");
const mongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const socketIO = require("socket.io");
const {Users} = require("./helpers/UsersClass");




const container = require("./container");


container.resolve(function(users, _, admin, home, group){
    
    mongoose.Promise = global.Promise;
    mongoose.connect("mongodb://root:Louis1951@ds123698.mlab.com:23698/footballkik_", function(err) {
        if(err) {
            console.log(err.message);
        } else {
            console.log("database connected")
        }
    });
    
    const app = setupExpress();
    
    function setupExpress(){
        const app = express();
        const server = http.createServer(app);
        const io = socketIO(server);
        server.listen(process.env.PORT, process.env.IP, function(){
            console.log("Footballkik has started");
        });
        
       configureExpress(app);
       
       require("./socket/groupchat")(io, Users);
       require("./socket/friend")(io);
        
       //setup router
       const router  = express.Router({mergeParams: true});
       users.setRouting(router);
       admin.SetAdminRouting(router);
       home.SetHomeRouting(router);
       group.SetGroupRouting(router);
       
       app.use(router);
       
    }
    

       function configureExpress(app){
           require("./passport/passport-local");
           require('./passport/passport-facebook');
	       require('./passport/passport-google');
           app.use(express.static('public'));
           app.use(cookieParser());
           app.set('view engine', 'ejs');
           app.use(bodyParser.json());
           app.use(bodyParser.urlencoded({extended: true}));
           
           app.use(validator());
           app.use(session({
               secret: "this issecret",
               resave: false,
               saveUninitialized: false,
               store: new mongoStore({mongooseConnection: mongoose.connection})
           }));
           
           app.use(flash());
           app.use(passport.initialize());
           app.use(passport.session());
           
           app.locals._ = _ ;
           app.use(function(req, res, next) {
    	 	  res.locals.user = req.user;
    	 	  next();
    	 	});
               
       }
    
});

