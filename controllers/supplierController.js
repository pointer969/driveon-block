// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var Supplier        = require('../models/Supplier')
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


    Supplier
        .find({}, function(err, suppliers){
          Supplier.count().exec(function(err, count){
              if (count > 0) {
                    res.render('suppliers/index',
                    { title: 'Un1ty | Suppliers', 
                        list: suppliers,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    res.render('suppliers/new.jade', {title: 'Un1ty | New Supplier',baseuri:baseurl});
                  }     
            });        
        })
        .limit(limit)
        .skip(limit * page);   
  };

exports.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    res.render('suppliers/new.jade', { title: 'Un1ty | New Supplier',baseuri:baseurl});
 };   
 
exports.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  Supplier.findOne({_id: req.params.id}).exec(function (err, supplier) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Supplier already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on Show:"+ err)  
                 break;
          }   
        } else {     
          req.flash('alert-info', 'Data saved with sucess!')       
          res.render('suppliers/show', {suppliers: supplier, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Internal error, please contact system admin.'});    
  }
 }    

exports.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Supplier.findOne({_id: req.params.id}).exec(function (err, usupplier) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Supplier already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on edit:"+ err)  
                 break;
          }   
        } else {          
          res.render('suppliers/edit', {suppliers: usupplier, baseuri:baseurl});
        }
      });
 };

exports.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Supplier.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                supplier: req.body.supplier, 
                name: req.body.name, 
                commercialName: req.body.commercialName, 
                business_segment: req.body.business_segment, 
                address1: req.body.address1, 
                address2: req.body.address2,
                address3: req.body.address3,
                district: req.body.district,
                city: req.body.city, 
                state: req.body.state, 
                country: req.body.country, 
                zipcode: req.body.zipcode, 
                email: req.body.email,
                activeStatus: req.body.activeStatus,
                updatedBy: req.user.email
              }
          }, 
          { new: true }, 
   function (err, supplier) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Supplier already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro on update:"+ err)  
                 break;
          }   
          res.render("suppliers/edit", {suppliers: req.body, baseuri:baseurl})
        }else{
          req.flash('alert-info', 'Data saved with sucess!')            
          res.redirect("/suppliers/show/"+supplier._id)
        }
      })
 }  

exports.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
    if(req.user) {           
      payload.modifiedBy = req.user.email
    }  
    
    var supplier = new Supplier(payload)      
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
        res.render('suppliers/new', { title: 'Un1ty | New Supplier', baseuri:baseurl})
      } else {          
        req.flash('alert-info', 'Data saved with sucess!')  
        res.redirect('/suppliers/show/'+supplier._id)
      }
    })
 }

exports.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Supplier.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Supplier already exists')    
                break;        
            default: 
                req.flash('alert-danger', "Error on delete:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Data deleted!')        
          res.redirect("/suppliers");
        }
      });
  };