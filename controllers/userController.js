// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var User            = require('../models/User')
var Profile         = require('../models/userProfile')
var Authority       = require('../models/UserAuthority')
var Customer        = require('../models/Customer')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var timezones       = require('../lib/timezones.json')
var async           = require('run-async')

var userController = {}

userController.home = function(req, res) {
  res.render('index', { user : req.user })
 }


userController.register = function(req, res) {
  res.render('register')
 }

userController.doRegister = function(req, res) {
  
  var user = new User({ 
    fullname: req.body.fullname, 
    email: req.body.email, 
    userProfile: "administrador",    
    active: true
  })   


  User.register( user,req.body.password, function(err, user) {
    if (err) {
      // return res.render('register', { user : user });
      console.log('Error on User registration:'+ err)
    }

    // passport.authenticate('local')(req, res, function () {
      res.redirect('/login');
    // });
  })
 }

userController.login = function(req, res) {
  res.render('login', {title:'Drive.On'})
 }


userController.doLogin = function(req, res, next) {
 
  passport.authenticate('local', function(err, user, info) {
    if (err) { 
        return next(err); 
    }
    // console.log(" doLogin User=>" + user + " \nErr=> " + err + " \nInfo=>" + JSON.stringify(info) );
    if (!user) { 
      req.flash('alert-danger', "User not found, authentication failed.")  
      return res.redirect('/login') 
    }
    
    req.logIn(user, function(loginErr) {      
      if (loginErr) { 
          return next(loginErr); 
      }
       return res.redirect('/');
    });
  })(req, res, next);
 }


userController.logout = function(req, res) {
  req.logout()
  res.redirect('/')
 }


/**
 * CRUD
 */ 
userController.list = function(req, res) {   
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var _id = req.query.item;
  var limit = 10;
  var uinfo = req.user;
 

  User.find().populate({
        path:'profile', 
        select:'ProfileDescription',
        match:{ active: true},
        options: { sort: { userProfile: -1 }}
      })
      .populate({
        path:'authority', 
        select:'AuthorityDescription',
        match:{ active: true },
        options: { sort: { authority: -1 }}
      })
      .populate({
        path:'customer', 
        select:'fullname',
        match:{ active: true },
        options: { sort: { fullname: -1 }}
      })
      .limit(limit)
      .skip(limit * page).exec(function(err, users){
        // console.log('user infoo:'+ users)
        if(err){          
          req.flash('alert-danger', 'Error on list user:'+err)  
          res.render('errors/500', {message:req.flash});                    
        }else{
          User.count().exec(function(err, count){
            if (count > 0) {
                   res.render('users/index',
                    { 
                      title: 'Drive.On | Users', 
                      list: users,
                      user_info: uinfo,
                      baseuri: baseurl,
                      page: page + 1,
                      pages: Math.ceil(count / limit)
                    }
                  )
                }else{
                  res.render('users/new.jade', {title: 'Drive.On | New User',baseuri:baseurl, tmz: timezones});
                }     
          })      
        }         
      }) 
 } 

userController.create = function(req, res){         
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  
  Profile
    .find({active: true}).exec(function(err, profile){
      if (err) {
        switch (err.code)
        {
          case 11000: 
              req.flash('alert-danger', 'User already exists.')    
              break;        
          default: 
              req.flash('alert-danger', "Error on create new user:"+ err)  
              break;
        }   
      }else{  
          Authority
            .find({active: true}).exec(function(err, authority){
              if (err) {
                switch (err.code)
                {
                  case 11000: 
                      req.flash('alert-danger', 'Authority already exists.')    
                      break;        
                  default: 
                      req.flash('alert-danger', "Error on Authority list:"+ err)  
                      break;
                }   
              }else{ 
                  Customer
                    .find({active: true}).exec(function(err, customer){
                      if (err) {
                        switch (err.code)
                        {
                          case 11000: 
                              req.flash('alert-danger', 'Customer already exists.')    
                              break;        
                          default: 
                              req.flash('alert-danger', "Error when list customer:"+ err)  
                              break;
                        }   
                      }else{
                        res.render('users/new.jade', { title: 'Drive.On | New User',
                            baseuri: baseurl,
                            profiles: profile,
                            authorities: authority,
                            customers: customer,
                            tmz: timezones
                          })
                      } 
                  })    
              } 
          })  
      }
    })  



    
 }   

userController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  if (req.params.id != null || req.params.id != undefined) {      
  User
  .findOne({_id: req.params.id})
  .populate({
    path:'profile', 
    select:'ProfileDescription',
    match:{ active: true},
    options: { sort: { userProfile: -1 }}
  })
  .populate({
    path:'authority', 
    select:'AuthorityDescription',
    match:{ active: true },
    options: { sort: { AuthorityDescription: -1 }}
  })
  .populate({
    path:'customer', 
    select:'fullname',
    match:{ active: true },
    options: { sort: { fullname: -1 }}
  })
  .exec(function (err, user) {
    // console.log('user='+user)
        if (err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Data already exists.')    
                break;        
            default: 
                req.flash('alert-danger', "Error on show:"+ err)  
                break;
          }   
        } else {     
          req.flash('alert-info', 'Data saved with success!')       
          res.render('users/show', {users: user, baseuri:baseurl, tmz: timezones});
        }
      })
  } else {    
    res.render('errors/500', {message:'Internal Error, please contact system admin!'});    
  }
 }    

userController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  User.findOne({_id: req.params.id}).exec(function (err, uuser) {
        if (err) {          
            req.flash('alert-danger', "Error on edit:"+ err)              
        } else {          
          Profile.find().exec( function (err, profile){
            if(err){
              req.flash('alert-danger', "Error on user profile list:"+ err)  
            }else{
              Authority.find().exec( function (err, authority){
               if(err){
                  req.flash('alert-danger', "Error on Authority list:"+ err) 
               } else {
                  Customer.find().exec( function (err, customer){
                    if(err){
                       req.flash('alert-danger', "Error on Customer lisr:"+ err) 
                    } else {
                    res.render('users/edit', {users: uuser, baseuri:baseurl, profiles:profile, authorities: authority, customers: customer, tmz: timezones})
                    }
                  })
               }
              })  
            }            
          })
          
        }
      })
  }

userController.update = function(req, res){  
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  var uinfo = req.user
  var npwd = req.body.password

   User.findByIdAndUpdate(
        req.params.id,          
        { $set: 
            { 
              fullname: req.body.fullname, 
              email: req.body.email, 
              userProfile: req.body.profile,
              authority: req.body.authority,
              customer: req.body.customer,
              gender: req.body.gender,
              active: req.body.active,              
              timezone: req.body.timezone,
              modifiedBy: uinfo.email
            }
        }, 
        { new: true }, 
 function (err, user) {                                                              
      if (err) {         
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Data already exists.')    
               break;        
           default: 
               req.flash('alert-danger', "Error on update:"+ err)  
               break;
        }   
        res.render("users/edit", {users: req.body, baseuri:baseurl, tmz: timezones})
      }else{
        User.findByUsername(user.email).then(function(sanitizedUser){
          if (sanitizedUser){
              sanitizedUser.setPassword(npwd, function(){
                  sanitizedUser.save();
                  req.flash('alert-info', 'Data saved with success!') 
              })
          } else {
              req.flash('alert-danger', 'Failure when define user to change password. Please contact the admin.') 
          }          
        },function(err){
          req.flash('alert-danger', "Error on update:"+ err) 
          res.render("users/edit", {users: req.body, baseuri:baseurl})
        })
        res.redirect("/users/show/"+user._id)
      }
    })
  }   

userController.save  =   function(req, res){
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  var ulogin =  ''
  
  if (req.user){    
    ulogin =  req.user.email
  }

  var user = new User({ 
    fullname: req.body.fullname, 
    email: req.body.email, 
    userProfile: req.body.profile,
    authority: req.body.authority,
    customer: req.body.customer,
    gender: req.body.gender,
    timezone: req.body.timezone,
    active: req.body.active,
    modifiedBy: ulogin
  })      
  User.register(user, req.body.password, function(err, user) {      
    if(err) {  
      switch (err.code)
      {
         case 11000: 
             req.flash('alert-danger', 'Data already exists.')    
             break;        
         default: 
             req.flash('alert-danger', "Error on save:"+ err)  
             break;
      }              
      userController.create
    } else {          
      req.flash('alert-info', 'Data saved with success')  
      res.redirect('/users/show/'+user._id)
    }
   })
   }

userController.delete = function(req, res){    
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  User.remove({_id: req.params.id}, function(err) {
      if(err) {
        req.flash('alert-danger', "Error on delete:"+ err)          
      } else {    
        req.flash('alert-info', 'Data deleted with success!')        
        res.redirect("/users");
      }
    })
 }


module.exports = userController