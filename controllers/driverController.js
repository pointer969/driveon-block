// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var Driver        = require('../models/Driver')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var async           = require('run-async')

/**
 * CRUD
 */ 
exports.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };


    Driver
        .find({}, function(err, drivers){
          Driver.count().exec(function(err, count){
              if (count > 0) {
                    res.render('drivers/index',
                    { title: 'DriveOn Blockchain | Drivers', 
                        list: drivers,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    res.render('drivers/new.jade', {title: 'DriveOn Blockchain | New Driver',baseuri:baseurl});
                  }     
            });        
        })
        .limit(limit)
        .skip(limit * page);   
  };

exports.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    res.render('drivers/new.jade', { title: 'DriveOn Blockchain | New Driver',baseuri:baseurl});
 };   
 
exports.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  Driver.findOne({_id: req.params.id}).exec(function (err, driver) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Driver already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on Show:"+ err)  
                 break;
          }   
        } else {     
          req.flash('alert-info', 'Data saved with sucess!')       
          res.render('drivers/show', {drivers: driver, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Internal error, please contact system admin.'});    
  }
 }    

exports.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Driver.findOne({_id: req.params.id}).exec(function (err, udriver) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Driver already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on edit:"+ err)  
                 break;
          }   
        } else {          
          res.render('drivers/edit', {drivers: udriver, baseuri:baseurl});
        }
      });
 };

exports.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Driver.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                driverlicense: req.body.driverlicense, 
                name: req.body.name,                 
                active: req.body.active,
                updatedBy: req.user.email
              }
          }, 
          { new: true }, 
   function (err, supplier) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Driver already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro on update:"+ err)  
                 break;
          }   
          res.render("drivers/edit", {drivers: req.body, baseuri:baseurl})
        }else{
          req.flash('alert-info', 'Data saved with sucess!')            
          res.redirect("/drivers/show/"+supplier._id)
        }
      })
 }  

exports.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
    if(req.user) {           
      payload.modifiedBy = req.user.email
    }  
    
    var supplier = new Driver(payload)      
    supplier.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Supplier already exists.')    
               break;        
           default: 
               req.flash('alert-danger', "Error on save:"+ err)  
               break;
        }        
        res.render('drivers/new', { title: 'DriveOn Blockchain | New Supplier', baseuri:baseurl})
      } else {          
        req.flash('alert-info', 'Data saved with sucess!')  
        res.redirect('/drivers/show/'+supplier._id)
      }
    })
 }

exports.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Driver.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Driver already exists')    
                break;        
            default: 
                req.flash('alert-danger', "Error on delete:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Data deleted!')        
          res.redirect("/drivers");
        }
      });
  };