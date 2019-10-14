// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var Customer         = require('../models/Customer')
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


    Customer
        .find({}, function(err, customers){
          Customer.count().exec(function(err, count){
              if (count > 0) {
                    res.render('customers/index',
                    { title: 'Un1ty | Customers', 
                        list: customers,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    res.render('customers/new.jade', {title: 'Un1ty | New Customer',baseuri:baseurl});
                  }     
            });        
        })
        .limit(limit)
        .skip(limit * page);   
  };

exports.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    res.render('customers/new.jade', { title: 'Un1ty | New Customer',baseuri:baseurl});
 };   
 
exports.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  Customer.findOne({_id: req.params.id}).exec(function (err, customer) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Customer already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on Show:"+ err)  
                 break;
          }   
        } else {     
          req.flash('alert-info', 'Data saved with sucess!')       
          res.render('customers/show', {customers: customer, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Internal error, please contact system admin.'});    
  }
 }    

exports.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Customer.findOne({_id: req.params.id}).exec(function (err, ucustomer) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Customer already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on edit:"+ err)  
                 break;
          }   
        } else {          
          res.render('customers/edit', {customers: ucustomer, baseuri:baseurl});
        }
      });
 };

exports.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Customer.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                fullname: req.body.fullname, 
                email: req.body.email, 
                businesscode: req.body.businesscode, 
                address1: req.body.address1, 
                address2: req.body.address2, 
                zipcode: req.body.zipcode, 
                district: req.body.district, 
                city: req.body.city, 
                province: req.body.province, 
                country: req.body.country,
                active: req.body.active,
                modifiedBy: req.user.email
              }
          }, 
          { new: true }, 
   function (err, customer) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Customer already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro on update:"+ err)  
                 break;
          }   
          res.render("customers/edit", {customers: req.body, baseuri:baseurl})
        }else{
          req.flash('alert-info', 'Data saved with sucess!')            
          res.redirect("/customers/show/"+customer._id)
        }
      })
 }  

exports.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
    if(req.user) {           
      // console.log('Check req.user data:'+ JSON.stringify(req.user))
      payload.modifiedBy = req.user.email
    }  
    
    var customer = new Customer(payload)      
    customer.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Customer already exists.')    
               break;        
           default: 
               req.flash('alert-danger', "Error on save:"+ err)  
               break;
        }        
        res.render('customers/new', { title: 'Un1ty | New Customer', baseuri:baseurl})
      } else {          
        req.flash('alert-info', 'Data saved with sucess!')  
        res.redirect('/customers/show/'+customer._id)
      }
    })
 }

 exports.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Customer.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Customer already exists')    
                break;        
            default: 
                req.flash('alert-danger', "Error on delete:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Data deleted!')        
          res.redirect("/customers");
        }
      });
  };