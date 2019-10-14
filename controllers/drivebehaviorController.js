// 'use strict';
var mongoose        = require('mongoose')
var passport        = require('passport')
var DriveBehavior   = require('../models/DriveBehavior')
var Device          = require('../models/Device')
var Customer        = require('../models/Customer')
var User            = require('../models/User')
var cars            = require("../models/VehicleMB")
var carMaintenance  = require ('../models/VehicleMBPrognosis')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var async           = require('run-async')
var Carvars         = require('../models/Calcvar')
var Score           = require('../models/Score')
var dataref         = require('moment')
var position        = require('../models/VehicleMBPositions')
var moment          = require("moment");
var unid            = require("uuid/v4");
var drivebehaviorController = {}

 drivebehaviorController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
  
    
  User
    .findOne({email:req.user.email}).exec(function(err, user){  
      cars
      .find({})
      .exec(function(err, carss){    
                Carvars.find({active:true}).exec(function(error, idxvars){ 
                  console.log('Carros:' +  carss);                   
                        res.render('drivebehavior/index',
                        { title: 'DriveOn Integrator | Score', 
                            veiculos: carss,
                            titles: idxvars,
                            user_info: req.user,
                            baseuri: baseurl
                        }
                        )                    
                    }) 
      })
    })
    
  }

  drivebehaviorController.timeline = function(req, res){
    position
    .find()
    .exec(function (err, dias) {
      //  console.log("dias: %s", dias)
      if (err) {
        console.log("Error:", err);
      }else {
        var arrayMessage = []
        var olddia="";
         for(var i = 0; i < dias.length; i++) {
            var dia = dias[i].Header.Position.timestamp.substring(0, 10);
            if (olddia != dia){
              var message0 =  { "tDay": dia }
              var iid =  unid();
              var retorno = {  
                  "id": iid,
                  "title": "Dias",                     
                  "content": dia +  
                      ' <span style="color:#4682B4;">Trechos</span>',
                  "start": moment(dia,"YYYY-MM-DD").format("DD-MM-YYYY"),
                  "type": "box"
              };   
              arrayMessage.push(retorno);
            }
            olddia = dia;            
         }
      } 
      res.json(arrayMessage)  
    })
  }
  drivebehaviorController.scorehistory =  function(req, res) { 
    
       // Message.find({'dongleCode':dongleCode,'eventcode':{'$ne':'0220'}}).sort({$natural :1}).limit(5).exec(function (err, message) {
    
      // console.log("Message: %s", message)
      // if (err) {
      //   console.log("Error:", err);
      // }else {
        var arrayMessage = []
  
      //   for(var i = 0; i < message.length; i++) {
  
      //     var id             = message[i]._id
      //     var gpsData        = message[i].gpsData
      //     var time           = message[i].time
      //     var dateReceived   = message[i].dateReceived
      //     var eventcode      = message[i].eventcode
      //     var dongleCode     = message[i].dongleCode
  
          var message0 =  { "ScoreDate": "2018-09-11", "ScoreValue": 9.8 }
          arrayMessage.push(message0);

          message0 =  { "ScoreDate": "2018-09-12", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
         
          message0 =  { "ScoreDate": "2018-09-13", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-14", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-15", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-16", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-17", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-18", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-19", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-20", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-21", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-22", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-23", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-24", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-25", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-26", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-27", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-28", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-29", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
          message0 =  { "ScoreDate": "2018-09-30", "ScoreValue": randomIntFromInterval(0,10) }
          arrayMessage.push(message0);
         
        // }        
  
        res.json({data: arrayMessage})
    //   }
    // })
  }

  drivebehaviorController.MaintenanceScorePerDay =  function(req, res) { 

    var scoreDate = req.params.id
    var payload = req.body
    
    
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };
  
        
  User
    .findOne({email:req.user.email}).exec(function(err, user){  
      cars
      .find({})
      .exec(function(err, carss){    
            Carvars.find({active:true}).exec(function(error, idxvars){ 
              
                  console.log('Carros:' +  carss);                   
                        res.render('drivebehavior/index',
                        { title: 'DriveOn Integrator | Score', 
                            veiculos: carss,
                            titles: idxvars,
                            user_info: req.user,
                            baseuri: baseurl
                        }
                        )                    
                    }) 
      })
    })
    
    }



module.exports = drivebehaviorController

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}