var mongoose        = require('mongoose')
var passport        = require('passport')
var pwqc            = require('../models/ProcessingWaterQC')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var async           = require('run-async')

var pwqcController = {}

/**
 * CRUD
 */ 
pwqcController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };


    pwqc
        .find({}, function(err, wqc){
          pwqc.count().exec(function(err, count){
              if (count > 0) {
                    res.render('watercontrol/index',
                    { title: 'DriveOn Blockchain | Water Quality Control', 
                        list: wqc,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                     res.render('watercontrol/new', { title: 'DriveOn Blockchain | New Water QC Input',baseuri:baseurl});
                  }
            });        
        })  
        .sort({$natural:-1})      
        .limit(limit)
        .skip(limit * page)
  }

pwqcController.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    console.log('Entrou create'); 
    res.render('watercontrol/new.jade', { title: 'DriveOn Blockchain | New Water QC Input',baseuri:baseurl});
 }   
 
pwqcController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  pwqc.findOne({_id: req.params.id}).exec(function (err, wqc) {
        if (err) {         
          req.flash('alert-danger', "Error on Show:"+ err)                
        } else {     
          req.flash('alert-info', 'Data Saved!')       
          res.render('watercontrol/show', { title: 'DriveOn Blockchain | New Water QC Input', wqclist: wqc, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Internel Error, please call system admin!'});    
  }
 }    

pwqcController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  pwqc.findOne({_id: req.params.id}).exec(function (err, upwqc) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Data already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on Edit:"+ err)  
                 break;
          }   
        } else {          
          res.render('watercontrol/edit', { title: 'DriveOn Blockchain | New Water QC Input', wqclist: upwqc, baseuri:baseurl});
        }
      })
 }

pwqcController.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    pwqc.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                placeid 	:req.body.placeid,
                date   :req.body.date,
                time :req.body.time,
                ph     :req.body.ph,
                cloroppm    :req.body.cloroppm,
                status     :req.body.status, 
                colector:req.user.email
              }
          }, 
          { new: true }, 
   function (err, profile) {                                                              
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
          res.render("watercontrol/edit", { title: 'DriveOn Blockchain | New Water QC Input',wqclist: req.body, baseuri:baseurl})
        }else{          
          res.redirect("/processing/watercontrol/show/"+profile._id)
        }
      })
 }  

pwqcController.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    var wqc = new pwqc(payload)      
    
    wqc.save(function(err) {
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
      } else {          
        res.redirect('/processing/watercontrol/show/'+wqc._id)
      }
      res.render('watercontrol/new.jade', { title: 'DriveOn Blockchain | New Water QC Input', baseuri:baseurl});
    })
 }

pwqcController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    pwqc.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Data already exists.')    
                break;        
            default: 
                req.flash('alert-danger', "Error on delete:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Data deleted!')        
          res.redirect("/processing/watercontrol")
        }
      })
  }

module.exports = pwqcController  