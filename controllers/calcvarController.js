// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var Calcvar         = require('../models/Calcvar')
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
    var clclogic = Calcvar.schema.path('calctype').enumValues 
    var vlrlogic = Calcvar.schema.path('valtype').enumValues  
    var indexseq = Calcvar.schema.path('indexNo').enumValues 

    Calcvar
        .find({}, function(err, calcvars){
          Calcvar.count().exec(function(err, count){
              if (count > 0) {
                    res.render('calcvars/index',
                    { title: 'DriveOn Integrator | Variáveis para Cálculo', 
                        list: calcvars,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{                    
                    res.render('calcvars/new.jade', {title: 'DriveOn | Nova Variável para Cálculo', calctypes:clclogic, valtypes:vlrlogic, indexno:indexseq, baseuri:baseurl});
                  }     
            });        
        })
        .limit(limit)
        .skip(limit * page);   
  };

exports.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"   
    var clclogic = Calcvar.schema.path('calctype').enumValues
    var vlrlogic = Calcvar.schema.path('valtype').enumValues
    var indexseq = Calcvar.schema.path('indexNo').enumValues 
    res.render('calcvars/new.jade', { title: 'DriveOn | Nova Variável para Cálculo', calctypes:clclogic, valtypes:vlrlogic, indexno:indexseq, baseuri:baseurl})
 };   
 
exports.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  Calcvar.findOne({_id: req.params.id}).exec(function (err, profile) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Estes dados já existem no registro de variáves.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Erro ao exibir:"+ err)  
                 break;
          }   
        } else {     
          var clclogic = Calcvar.schema.path('calctype').enumValues
          var vlrlogic = Calcvar.schema.path('valtype').enumValues          
          var indexseq = Calcvar.schema.path('indexNo').enumValues

          req.flash('alert-info', 'Dados salvos com sucesso!')       
          res.render('calcvars/show', {calcvars: profile, calctypes:clclogic, valtypes:vlrlogic, indexno:indexseq, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Erro interno, favor informar o administrador!'});    
  }
 }    

exports.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Calcvar.findOne({_id: req.params.id}).exec(function (err, uprofile) {
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
          var clclogic = Calcvar.schema.path('calctype').enumValues
          var vlrlogic = Calcvar.schema.path('valtype').enumValues                    
          var indexseq = Calcvar.schema.path('indexNo').enumValues     
          res.render('calcvars/edit', {calcvars: uprofile, calctypes:clclogic, valtypes:vlrlogic, indexnos:indexseq, baseuri:baseurl})
        }
      });
 };

exports.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Calcvar.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                item: req.body.item, 
                description: req.body.description, 
                active: req.body.active,
                calctype: req.body.calctype,
                valtype: req.body.valtype,
                indexNo: req.body.indexno,
                defaultvalue: req.body.defaultvalue,
                minvalue: req.body.minvalue,
                maxvalue: req.body.maxvalue,
                modifiedBy: req.user.email
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
          var clclogic = Calcvar.schema.path('calctype').enumValues
          var vlrlogic = Calcvar.schema.path('valtype').enumValues                                
          var indexseq = Calcvar.schema.path('indexNo').enumValues     
          res.render('calcvars/edit', {calcvars: uprofile, calctypes:clclogic, valtypes:vlrlogic, indexno:indexseq, baseuri:baseurl})
        }else{
          req.flash('alert-info', 'Dados salvos com sucesso!')            
          res.redirect("/calcvars/show/"+profile._id)
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
    
    var profile = new Calcvar(payload)      
    //  console.log('Check profile data:'+ JSON.stringify(profile))
    profile.save(function(err) {
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
        var clclogic = Calcvar.schema.path('calctype').enumValues
        var vlrlogic = Calcvar.schema.path('valtype').enumValues                                       
        var indexseq = Calcvar.schema.path('indexNo').enumValues 
    
        res.render('calcvars/new.jade', { title: 'DriveOn | Nova Variável para Cálculo', calctypes:clclogic, valtypes:vlrlogic, indexno:indexseq, baseuri:baseurl})
      } else {          
        req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/calcvars/show/'+profile._id)
      }
    })
 }

exports.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Calcvar.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Estes dados já existem no registro de perfis.')    
                break;        
            default: 
                req.flash('alert-danger', "Erro ao deletar:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Dados removidos com sucesso!')        
          res.redirect("/calcvars");
        }
      })
  }