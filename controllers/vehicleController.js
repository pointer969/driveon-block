// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var Vehicle         = require('../models/Vehicle')
var Device          = require('../models/Device')
var Customer        = require('../models/Customer')
var User            = require('../models/User')

var vehicleController = {}

/**
 * CRUD
 */ 
 vehicleController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
    
    Vehicle
        .find()
        .populate({
          path:'device', 
          select:'device',
          match:{ active: true },
          options: { sort: { device: -1 }}
        })
        .populate({
          path:'customer', 
          select:'fullname',
          match:{ active: true },
          options: { sort: { fullname: -1 }}
        })
        .limit(limit)
        .skip(limit * page)
        .exec(function(err, vehicles){
          Vehicle.count().exec(function(err, count){
              if (count > 0) {
                    res.render('vehicles/index',
                    { title: 'DriveOn Blockchain | Vehicle', 
                        list: vehicles,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    Device
                          .find({active: true}).exec(function(err, device){
                            if (err) {
                              switch (err.code)
                              {
                                case 11000: 
                                    req.flash('alert-danger', 'Data already exists.')    
                                    break;        
                                default: 
                                    req.flash('alert-danger', "Error on List:"+ err)  
                                    break;
                              }   
                            }else{  
                                Customer
                                  .find({active: true}).exec(function(err, customer){
                                    if (err) {
                                      switch (err.code)
                                      {
                                        case 11000: 
                                            req.flash('alert-danger', 'Data already exists.')    
                                            break;        
                                        default: 
                                            req.flash('alert-danger', "Error on List:"+ err)  
                                            break;
                                      }   
                                    }else{                                    
                                              res.render('vehicles/new.jade', { title: 'DriveOn Blockchain | New Vehicle',
                                                  baseuri: baseurl,
                                                  devices: device,
                                                  customers: customer
                                                })
                                    } 
                                })  
                            }
                          })  

                  }     
            })      
        })  
  }

 vehicleController.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    
    Device
    .find({active: true}).exec(function(err, device){
      if (err) {
        switch (err.code)
        {
          case 11000: 
              req.flash('alert-danger', 'Data already exists.')    
              break;        
          default: 
              req.flash('alert-danger', "Error on create a new vehicle:"+ err)  
              break;
        }   
      }else{  
          Customer
            .find({active: true}).exec(function(err, customer){
              if (err) {
                switch (err.code)
                {
                  case 11000: 
                      req.flash('alert-danger', 'Data already exists.')    
                      break;        
                  default: 
                      req.flash('alert-danger', "Error on loading Customer data:"+ err)  
                      break;
                }   
              }else{                                    
                        res.render('vehicles/new.jade', { title: 'DriveOn Blockchain | New Vehicle',
                            baseuri: baseurl,
                            devices: device,
                            customers: customer
                          })
              } 
          })  
      }
    })  


  } 
 
 vehicleController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  if (req.params.id != null || req.params.id != undefined) {      
  Vehicle.findOne({_id: req.params.id})
  .populate({
    path:'device', 
    select:'device',
    match:{ active: true},
    options: { sort: { device: -1 }}
  })
  .populate({
    path:'customer', 
    select:'fullname',
    match:{ active: true },
    options: { sort: { fullname: -1 }}
  })
  .exec(function (err, vehicle) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Data already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on create new:"+ err)  
                 break;
          }   
        } else {     
          req.flash('alert-info', 'Data saved with sucess!') 
          res.render('vehicles/show', {vehicles: vehicle, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Internal error, please contact system admin!'});    
  }
  }    

 vehicleController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Vehicle.findOne({_id: req.params.id})
  .populate({
    path:'device', 
    select:'device',
    match:{ active: true},
    options: { sort: { device: -1 }}
  })
  .populate({
    path:'customer', 
    select:'fullname',
    match:{ active: true },
    options: { sort: { fullname: -1 }}
  })
  .exec(function (err, uprofile) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {   
          
          Device
                          .find({active: true}).exec(function(err, device){
                            if (err) {
                              switch (err.code)
                              {
                                case 11000: 
                                    req.flash('alert-danger', 'Estes dados já existem no registro de devices.')    
                                    break;        
                                default: 
                                    req.flash('alert-danger', "Erro ao carregar os perfis de devices:"+ err)  
                                    break;
                              }   
                            }else{  
                                Customer
                                  .find({active: true}).exec(function(err, customer){
                                    if (err) {
                                      
                                            req.flash('alert-danger', "Error on edit:"+ err)  
                                            
                                    }else{                                    
                                              res.render('vehicles/edit', { title: 'DriveOn Blockchain | New Vehicle',
                                                  baseuri: baseurl,
                                                  devices: device,
                                                  customers: customer,
                                                  vehicles: uprofile
                                                })
                                    } 
                                })  
                            }
                          })  


           res.render('vehicles/edit', {vehicles: uprofile, baseuri:baseurl});
        }
      })
  }

 vehicleController.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Vehicle.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                plate: req.body.plate,
                device: req.body.device,
                vin: req.body.vin,
                model: req.body.model,
                color: req.body.color,
                state: req.body.state,
                customer: req.body.customer,
                motor: req.body.motor,
                fueltype: req.body.fueltype, 
                manufYear: req.body.manufYear,               
                active: req.body.active,
              }
          }, 
          { new: true }, 
   function (err, profile) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err)  
                 break;
          }   
          res.render("vehicles/edit", {vehicles: req.body, baseuri:baseurl})
        }else{
          req.flash('alert-info', 'Data saved with sucess!')            
          res.redirect("/vehicles/show/"+profile._id)
        }
      })
  }  

 vehicleController.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
       
    var vehicle = new Vehicle(payload)      
    vehicle.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err)  
               break;
        }        
            Device.find({active: true}).exec(function(err, device){
                      if (err) {
                        switch (err.code)
                        {
                          case 11000: 
                              req.flash('alert-danger', 'Estes dados já existem no registro de devices.')    
                              break;        
                          default: 
                              req.flash('alert-danger', "Erro ao carregar os perfis de devices:"+ err)  
                              break;
                        }   
                      }else{  
                          Customer
                            .find({active: true}).exec(function(err, customer){
                              if (err) {
                                switch (err.code)
                                {
                                  case 11000: 
                                      req.flash('alert-danger', 'Estes dados já existem no registro de usuarios.')    
                                      break;        
                                  default: 
                                      req.flash('alert-danger', "Erro ao carregar as autoridades de usuário:"+ err)  
                                      break;
                                }   
                              }else{                                    
                                    res.render('vehicles/edit', { title: 'DriveOn Blockchain | New Vehicle',
                                        baseuri: baseurl,
                                        devices: device,
                                        customers: customer,
                                        vehicles: uprofile
                                      })
                              } 
                          })  
                      }
                    })  

      } else {          
        req.flash('alert-info', 'Data saved with sucess!')  
        res.redirect('/vehicles/show/'+vehicle._id)
      }
    })
  }

 vehicleController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Vehicle.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
                break;        
            default: 
                req.flash('alert-danger', "Error on delete:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Data deleted with sucess!')        
          res.redirect("/vehicles");
        }
      });
  };


 vehicleController.listbyUser = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
     
    User
      .findOne({email:req.user.email}).exec(function(err, user){ 
          Vehicle
              .find({customer:user.customer})             
              .exec(function(err, vehicles){
                Vehicle.count().exec(function(err, count){                    
                          res.render('vehicles/alarms',
                          { title: 'DriveOn Blockchain Integrator | Alarmes', 
                              list: vehicles,
                              user_info: req.user,
                              baseuri: baseurl,
                              page: page + 1,
                              pages: Math.ceil(count / limit)}
                          )
                           
                  })      
              })  
      })        
  }
 vehicleController.analyticsbyUser = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
     
    User
      .findOne({email:req.user.email}).exec(function(err, user){ 
          Vehicle
              .find({customer:user.customer})
              .limit(limit)
              .skip(limit * page)
              .exec(function(err, vehicles){
                Vehicle.count().exec(function(err, count){                    
                          res.render('analytics',
                          { title: 'DriveOn Blockchain Integrator', 
                              list: vehicles,
                              user_info: req.user,
                              baseuri: baseurl,
                              page: page + 1,
                              pages: Math.ceil(count / limit)}
                          )
                           
                  })      
              })  
      })        
  }

module.exports = vehicleController