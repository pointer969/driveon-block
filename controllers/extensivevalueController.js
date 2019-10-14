// var mongoose        = require('mongoose')
// var passport        = require('passport')
var ExtensiveValue       = require('../models/ExtensiveValue')
var ExtensiveClass       = require('../models/ExtensiveClass')
// var bcrypt          = require('bcrypt')
// var jwt             = require('jsonwebtoken')
// var config          = require('../lib/config')
// var async           = require('run-async')

var extensivevalueController = {}

/**
 * CRUD
 */ 
extensivevalueController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };


    ExtensiveValue
        .find()
        .populate({
          path:'class', 
          select:'description',
          match:{ active: true },
          options: { sort: { class: -1 }}
        })
        .limit(limit)
        .skip(limit * page)
        .exec( function(err, extensivevalues){
          ExtensiveValue.count().exec(function(err, count){
              if (count > 0) {
                  // console.log('Debug:' + extensivevalues)
                    res.render('extensivevalues/index',
                    { title: 'DriveOn Blockchain | Extensive Values', 
                        list: extensivevalues,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    ExtensiveClass.find({active: true}).exec(function (err, extvalues) { 
                      // console.log('logo:'+extvalues)
                      if (err) {         
                        req.flash('alert-danger', "Error on show:"+ err)                
                      } else { 
                        res.render('extensivevalues/new.jade', { title: 'DriveOn Blockchain | New Value', extvalueses: extvalues, baseuri:baseurl})
                      }  

                    })  
                  }     
            });        
        })        
        
  }

extensivevalueController.create = function(req, res){  
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  ExtensiveClass.find({active: true}).exec(function (err, extvalues) { 
    // console.log('logo:'+extvalues)
    if (err) {         
      req.flash('alert-danger', "Error on show:"+ err)                
    } else { 
      res.render('extensivevalues/new.jade', { title: 'DriveOn Blockchain | New Value', extvalueses: extvalues, baseuri:baseurl})
    }  
   
  })  
 }   
 
extensivevalueController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  if (req.params.id != null || req.params.id != undefined) {      
    ExtensiveValue.findOne({_id: req.params.id}).exec(function (err, extvalues) {
        if (err) {         
          req.flash('alert-danger', "Error on Show:"+ err)                
        } else {     
          // req.flash('alert-info', 'Dados salvos com sucesso!')       
          res.render('extensivevalues/show', {extvalueses: extvalues, baseuri:baseurl})
        }
      })
  } else {    
    res.render('errors/500', {message:'Internal Error, please contact the administrator!'})
  }
 }    

extensivevalueController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  ExtensiveValue.findOne({_id: req.params.id}).exec(function (err, uprofile) {
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
          
          ExtensiveClass.find({active: true}).exec(function (err, extclass) { 
            // console.log('logo:'+extvalues)
            if (err) {         
              req.flash('alert-danger', "Error on Edit:"+ err)                
            } else {               
              res.render('extensivevalues/edit', {extvalueses: uprofile, extclasses: extclass, baseuri:baseurl});
            }  
           
          }) 
        }
      })
 }

extensivevalueController.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    ExtensiveValue.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                value:req.body.value,
                class 	:req.body.class,
                description :req.body.description,
                active     :req.body.active,               
                modifiedBy: req.user.email
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
          res.render("extensivevalues/edit", {extensivevalues: req.body, baseuri:baseurl})
        }else{
          // req.flash('alert-info', 'Dados salvos com sucesso!')            
          res.redirect("/extensivevalues/show/"+profile._id)
        }
      })
 }  

extensivevalueController.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
    if(req.user) {           
      // console.log('Check req.user data:'+ JSON.stringify(req.user))
      payload.modifiedBy = req.user.email
    }  
    
    var extvalue = new ExtensiveValue(payload)      
    
    extvalue.save(function(err) {
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
        ExtensiveClass.find({active: true}).exec(function (err, extvalues) { 
          // console.log('logo:'+extvalues)
          if (err) {         
            req.flash('alert-danger', "Error on show:"+ err)                
          } else { 
            res.render('extensivevalues/new.jade', { title: 'DriveOn Blockchain | New Value', extvalueses: extvalues, baseuri:baseurl})
          }  
         
        })  
      } else {          
        // req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/extensivevalues/show/'+extvalue._id)
      }
      ExtensiveClass.find({active: true}).exec(function (err, extvalues) { 
        // console.log('logo:'+extvalues)
        if (err) {         
          req.flash('alert-danger', "Error on Show:"+ err)                
        } else { 
          res.render('extensivevalues/new.jade', { title: 'DriveOn Blockchain | New Value', extvalueses: extvalues, baseuri:baseurl})
        }  
       
      })  
    })
 }

extensivevalueController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    ExtensiveValue.remove({_id: req.params.id}, function(err) {
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
          req.flash('alert-info', 'Data removed with sucess!')        
          res.redirect("/extensivevalues");
        }
      })
  }

module.exports = extensivevalueController  