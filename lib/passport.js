var passport        = require('passport')
var LocalStrategy   = require('passport-local').Strategy;
var config          = require('./config')
var User       		= require('../models/User.js')
var bCrypt           = require('bcrypt');
module.exports = function(passport) {
        // used to serialize the user for the session
        passport.serializeUser(function(User, done) {            
            done(null, User.id);
        });
    
        // used to deserialize the user
        passport.deserializeUser(function(id, done) {            
            User.findById(id, function(err, user) {
                done(err, user);
            });
        });

        passport.use('local-login', new LocalStrategy({            
            // by default, local strategy uses username and password, we will override with email
            usernameField : 'username',
            passwordField : 'password',
            passReqToCallback : true // allows us to pass back the entire request to the callback
        },function(req, user, password, done) { // callback with email and password from our form
    
            // find a user whose email is the same as the forms email
            // we are checking to see if the user trying to login already exists            
            User.findOne({ 'email' :  user }, function(err, user) {
                // if there are any errors, return the error before anything else
                if (err){                
                    return done(err);   
                }                    
                               
                if (!user){                    
                    return done(null, false, req.flash('loginMessage', 'User not found')); // req.flash is the way to set flashdata using connect-flash
                }                        
               

                if (!req.session) {
                    console.error('\nDashboard Runtime Error:\n\napp must have session middleware installed. Try adding "express-session" to your express instance.\n');
                    process.exit(1);
                }                  
                               
                return done(null, user);
                
            });
    
        }));

        var isValidPassword = function(user, password){
            return bCrypt.compareSync(password, user.password);
        }


}