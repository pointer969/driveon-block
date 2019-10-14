var mongoose = require("mongoose")
var Message = require("../models/Message")
var Device = require("../models/Device")
var Vehicle = require('../models/Vehicle')
var moment = require('moment')
var unid            = require("uuid/v4");

var messageController = {}

messageController.list = function(req, res) {

  var dongleCode = req.params.id

  Message.find({'dongleCode':dongleCode,'eventcode':{'$ne':'0220'}}).sort({$natural :1}).limit(5).exec(function (err, message) {
    
    // console.log("Message: %s", message)
    if (err) {
      console.log("Error:", err);
    }else {
      var arrayMessage = []

      for(var i = 0; i < message.length; i++) {

        var id             = message[i]._id
        var gpsData        = message[i].gpsData
        var time           = message[i].time
        var dateReceived   = message[i].dateReceived
        var eventcode      = message[i].eventcode
        var dongleCode     = message[i].dongleCode

        var message0 =  { "_id": id, "gpsData": gpsData, "time": time, 
        "dateReceived": dateReceived, "eventcode": eventcode, "dongleCode": dongleCode }
        arrayMessage.push(message0)
      }        

      res.json({message: arrayMessage})
    }
  })
 }


messageController.getgeo = function(req, res) {
  
    var dongleCode = req.params.id;
  Device.findOne({_id:dongleCode}, function(err, dev){        

  var dvice = dev.device  
    Message
      .find({'dongleCode':dvice,'eventcode':{'$ne':'0220'}})
      .sort({$natural:-1})
      .limit(50)
      .exec(function (err, message) {             
          if (err) {
            console.log("Error:", err);
          }else {
            var arrayCurrinfo = []
            var latlon = [];
            for(var i = 0; i < message.length; i++) {      
              var gpsData  = message[i].gpsData;
              if(gpsData != undefined){
                var geoloc =  gpsData.split(',');              
                var lati = geoloc[0];              
                var logi = geoloc[1];                              
                latlon.push(lati,logi);       
                arrayCurrinfo.push(latlon);       
                latlon = [];        
              }              
            };            
            res.json(arrayCurrinfo);        
          }
    })
  })
 }

messageController.show = function(req, res) {

  console.log("show")

    Message.findOne({_id: req.params.id}).exec(function (err, message) {
      if (err) {
        console.log("Error:", err)
      }else {

        var id             = message._id
        var gpsData        = message.gpsData
        var time           = message.time
        var dateReceived   = message.dateReceived
        var eventcode      = message.eventcode
        var dongleCode     = message.dongleCode

        var message0 =  { "_id": id, "gpsData": gpsData, "time": time, 
        "dateReceived": dateReceived, "eventcode": eventcode, "dongleCode": dongleCode }

        res.json({message: message0})
      }
    });
  };

messageController.SOSCounter = function(req, res) {
    
    Message
      .find({'eventcode':'0320','alarmNo':'SOS'}).count().exec(function(err, count){                       
            var message0 = {'total':count}
                res.json(message0);                     
          });        
      
    };
  
messageController.GuinchoCounter = function(req, res) {
    
    Message
      .find({'eventcode':'0320','alarmNo':'Towing'}).count().exec(function(err, count){                       
            var message0 = {'total':count}
                res.json(message0);                     
          });        
      
    };  

messageController.MILCounter = function(req, res) {
  
  Message
    .find({'eventcode':'0320','alarmNo':'MIL on'}).count().exec(function(err, count){                       
          var message0 = {'total':count}
              res.json(message0);                     
        });        
    
  };    

messageController.GASsum = function(req, res) {
  var dongleCode = req.params.id

  Message.findOne({'eventcode':'0120'}).sort({$natural :1}).exec(function (err, message) {  
    if (err) {
      console.log("Error GASsum:", err);
    }else {
        // console.log('Checkl:'+message)
        if (message == null){
          var sumgas = 0         
        }else{          
          var sumgas = message.currentTripFuelConsumption  
        }          
        var message0 = {'total':sumgas}
        res.json(message0);                     
    }          
        });        
    
  };  

  
messageController.getgeolist = function(req, res) {
    
      var dongleCode = req.params.id
      
      // var d = new Date(),
      // month = '' + (d.getMonth() + 1),
      // day = '' + d.getDate(),
      // year = d.getFullYear();

      // if (month.length < 2) month = '0' + month;
      // if (day.length < 2) day = '0' + day;
      // var dbase = [year, month, day].join('-');
 Device.findOne({_id:dongleCode}, function(err, dev){        
 
        var dvice = dev.device
      Message.find({'dongleCode':dvice,'eventcode':{'$ne':'0220'}}).sort({$natural:-1}).limit(100).exec(function (err, message) {        
          
        if (err) {
          console.log("Error:", err);
        }else {
          var arrayCurrinfo = []
          for(var i = 0; i < message.length; i++) {
            var id             = message[i]._id
            var gpsData        = message[i].gpsData
            var time           = message[i].time
            var dateReceived   = message[i].dateReceived
            var eventcode      = message[i].eventcode
            var dongleCode     = message[i].dongleCode
  
            if (gpsData) {
              var message =  { "_id": id, "gpsData": gpsData, "time": time, 
              "dateReceived": dateReceived, "eventcode": eventcode, "dongleCode": dongleCode }
  
              arrayCurrinfo.push(message)              
            }            
          }
          res.json(arrayCurrinfo)
        }
      })
     })  
    }

messageController.getAlarm = function(req, res) {
  var dongleCode = req.params.device
  // console.log('Entrou com o dongle:'+ dongleCode)       
  var actualday = moment().utc().day(0).format("YYYY-MM-DD") 
  
  Device.find({_id:dongleCode, active:true}, function(err, dev){        
    for(var i = 0; i < dev.length; i++) {
      var dvice = dev[i].device
        // console.log('Dt ref:'+ actualday+ ' Device:'+ dvice)    
        Message
              .find({'dongleCode':dvice,'eventname':'alarm',dateReceived: new RegExp(actualday, "i")})
              .sort({$natural:-1})
              .exec(function(err, alarme){
                if(err) {
                  console.log('err='+err)                                       
                } else { 
                  var retmsg =[];
                  for(var k=0;k < alarme.length;k++){
                    var alarmno = alarme[k].alarmNo;
                    var alarmtag = alarme[k].alarmTag;
                    var alarmcur  = alarme[k].alarmCurrent;
                    var dtrecv    = alarme[k].dateReceived;
                    var iid =  unid();

                     if (alarmno == "High temperature"){
                      // High temperature                        
                      var retorno = {  
                          "id": iid,
                          "title": alarmno,                     
                          "content": alarmcur +  
                              ' <span style="color:#4682B4;">Temperatura do Motor</span>',
                          "start": moment(dtrecv,"YYYY-MM-DD HH:mm:ss"),
                          "type": "box"
                      };   
                      retmsg.push(retorno);    
                    }
                  }  
                  res.json(retmsg);
                }         
              })               
          }       
        })
      }    


messageController.chartMotorTemp = function(req, res) {
        var dongleCode = req.params.id
      
        Message.findOne({'dongleCode':dongleCode,'eventcode':'0120'}).sort({$natural :1}).exec(function (err, message) {  
            if (err) {
                console.log("chartMotorTemp Error:", err);
            }else {
              var arrayMessage = []
  
                    for(var i = 0; i < message.length; i++) {
                      if (message[i].pid1.noId == '0520'){
                        var tempera                   = message[i].pid1.dec
                      }else if(message[i].pid2.noId == '0520'){
                        var tempera                   = message[i].pid2.dec  
                      }else if(message[i].pid3.noId == '0520'){
                        var tempera                   = message[i].pid3.dec
                      }else if(message[i].pid4.noId == '0520'){
                        var tempera                   = message[i].pid4.dec
                      }else if(message[i].pid5.noId == '0520'){
                        var tempera                   = message[i].pid5.dec
                      }  
                      var id                        = message[i]._id
                      var dreceived                 = message[i].dreceived
                      // Adjust the calculation from Temperature
                      tempera = (tempera * 1)-40 
                      var message0 =  { "_id": id, "dreceived": dreceived, "temperatura": tempera }
                      arrayMessage.push(message0)
                    }        
              
                    res.json(arrayMessage)
            }
          });
  };  

messageController.getVoltage = function(req, res) {
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var dongleCode = req.params.id
          
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const _id = req.query.item;
    const limit = 10;
    const options = {
      limit: limit,
      page: page
    };        
    
 Device.findOne({_id:dongleCode}, function(err, dev){        
 
  var dvice = dev.device
    Message.find({dongleCode:dvice, eventcode:'0120'}).sort({$natural:-1}).limit(100).exec(function(err, message){
            if (err) {
              console.log("Error when load voltage:", err)
            }else {
                // console.log("info:", JSON.stringify( message ))
                // var arrayCurrinfo = []
                // for(var j = 0; j < message.length; j++) {
                //   var dateReceived   = message[j].dateReceived
                //   var volts          = message[j].voltage     
                //   var msg =  {  "dateReceived": dateReceived, "voltage": volts }      
                //   arrayCurrinfo.push(msg)                  
                // }
                // console.log("info:", JSON.stringify( arrayCurrinfo ))
                res.json(message)
              }     
          })  
            
    })
  } 

module.exports = messageController