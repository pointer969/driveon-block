// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var Authority       = require('../models/UserAuthority')
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


    Authority
        .find({}, function(err, authorities){
          Authority.count().exec(function(err, count){
              if (count > 0) {
                    res.render('authorities/index',
                    { title: 'DriveOn Integrator | Autoridades de Usuário', 
                        list: authorities,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    res.render('authorities/new.jade', {title: 'DriveOn | Nova Autoridade de Usuário',baseuri:baseurl});
                  }     
            });        
        })
        .limit(limit)
        .skip(limit * page);   
  };

exports.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    res.render('authorities/new.jade', { title: 'DriveOn | Nova Autoridade de Usuário',baseuri:baseurl});
 };   
 
exports.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  Authority.findOne({_id: req.params.id}).exec(function (err, authority) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de autoridades.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao exibir:"+ err)  
                 break;
          }   
        } else {     
          req.flash('alert-info', 'Dados salvos com sucesso!')       
          res.render('authorities/show', {authorities: authority, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
  }
 }    

exports.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Authority.findOne({_id: req.params.id}).exec(function (err, uprofile) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de autoridades.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao editar:"+ err)  
                 break;
          }   
        } else {          
          res.render('authorities/edit', {authorities: uprofile, baseuri:baseurl});
        }
      });
 };

exports.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Authority.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                userAuthority: req.body.userAuthority, 
                AuthorityDescription: req.body.AuthorityDescription, 
                active: req.body.active,
                modifiedBy: req.user.email
              }
          }, 
          { new: true }, 
   function (err, profile) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de autoridades.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao atualizar:"+ err)  
                 break;
          }   
          res.render("authorities/edit", {authorities: req.body, baseuri:baseurl})
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!')            
          res.redirect("/authorities/show/"+profile._id)
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
    
    var auth = new Authority(payload)      
    auth.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Estes dados já existem no registro de autoridades.')    
               break;        
           default: 
               req.flash('alert-danger', "Erro ao salvar:"+ err)  
               break;
        }        
        res.render('authorities/new', { title: 'DriveOn | Novo Perfil de Autoridade', baseuri:baseurl})
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/authorities/show/'+auth._id)
      }
    })
 }

 exports.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Authority.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de autoridades.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/authorities");
        }
      });
  };