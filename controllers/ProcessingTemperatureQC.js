var mongoose = require('mongoose')
var passport = require('passport')
var twqc = require('../models/ProcessingTemperatureQC')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var config = require('../lib/config')
var async = require('run-async')

var ExtensiveValue = require('../models/ExtensiveValue')
var ExtensiveClass = require('../models/ExtensiveClass')

var twqcController = {}

/**
 * CRUD
 */
twqcController.list = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var pid = req.params.pid;
  var pdescription= '';
  var limit = 10;
  var options = {
    limit: limit,
    page: page
  };

  // if (!pid){
  //   pid = 'places_processing'
  //   pdescription = 'Processing'
  // }
  // console.log('pid='+pid)
  switch(pid){
    case 'places_receive':
      pdescription = 'Receive'
      break
    case 'places_processing':
      pdescription = 'Processing' 
      break 
    case 'places_storage':
      pdescription = 'Storage' 
      break  
    default:
      pid = 'places_processing'
      pdescription = 'Processing'
  }


  // var place = getConfigurationArray(pid)
  // console.log('places='+place)
  twqc
    .find({}, function (err, wqc) {
      twqc.count().exec(function (err, count) {
        if (count > 0) {
          res.render('tempcontrol/index',
            {
              title: 'DriveOn Blockchain | Temperature Quality Control',
              list: wqc,   
              ptype: pid,    
              pdesc: pdescription,       
              user_info: req.user,
              baseuri: baseurl,
              page: page + 1,
              pages: Math.ceil(count / limit)
            }
          );
        } else {
          // res.render('tempcontrol/new', { title: 'DriveOn Blockchain | New Temperature QC Input', baseuri: baseurl,places: place });
          ExtensiveClass.findOne({ class: pid, active: true })
          .exec(function (err, exclass) {
            if (!err) {
              ExtensiveValue.findOne({ class: exclass._id, active: true })          
                .exec(function (err, values) {
                  if (!err) {
                    res.render('tempcontrol/new.jade', { title: 'DriveOn Blockchain | New Temperature QC Input', baseuri: baseurl, places: values, pdesc:pdescription, ptype:pid });
                  } else {
                    req.flash('alert-danger', "Error on Load Values:" + err)
                    res.render('tempcontrol/new.jade', { title: 'DriveOn Blockchain | New Temperature QC Input', baseuri: baseurl, places: values, pdesc:pdescription, ptype:pid });
                  }
                })
            } else {
              req.flash('alert-danger', "Error on Load Classes:" + err)
              res.render('tempcontrol/new.jade', { title: 'DriveOn Blockchain | New Temperature QC Input', baseuri: baseurl, places: values, pdesc:pdescription, ptype:pid });      
            }
          })
        }
      });
    })
    .sort({ $natural: -1 })
    .limit(limit)
    .skip(limit * page)
}

twqcController.create = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var pid = req.params.pid;

  switch(pid){
    case 'places_receive':
      pdescription = 'Receive'
      break
    case 'places_processing':
      pdescription = 'Processing' 
      break 
    case 'places_storage':
      pdescription = 'Storage' 
      break  
    default:
      pid = 'places_processing'
      pdescription = 'Processing'
  }
  // var place = getConfigurationArray(pid)
  // console.log('pid=>'+ pid + ' place=>' + place)
    ExtensiveClass.findOne({ class: pid, active: true })
     .exec(function (err, exclass) {
      if (!err) {
        ExtensiveValue.find({ class: exclass._id, active: true })          
          .exec(function (err, values) {
            // console.log('ExtensiveValue:' + JSON.stringify(values));
            if (!err) {
              res.render('tempcontrol/new.jade', { title: 'DriveOn Blockchain | New Temperature QC Input', baseuri: baseurl, places: values, pdesc:pdescription, ptype:pid });
            } else {
              req.flash('alert-danger', "Error on Load Values:" + err)
              res.render('tempcontrol/new.jade', { title: 'DriveOn Blockchain | New Temperature QC Input', baseuri: baseurl, places: values, pdesc:pdescription, ptype:pid });
            }
          })
      } else {
        req.flash('alert-danger', "Error on Load Classes:" + err)
        res.render('tempcontrol/new.jade', { title: 'DriveOn Blockchain | New Temperature QC Input', baseuri: baseurl, places: '', pdesc:pdescription, ptype:pid });      
      }
    })
 }

twqcController.show = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  if (req.params.id != null || req.params.id != undefined) {
    twqc.findOne({ _id: req.params.id }).exec(function (err, tqc) {
      if (err) {
        req.flash('alert-danger', "Error on Show:" + err)
      } else {
        req.flash('alert-info', 'Data Saved!')
        res.render('tempcontrol/show', { title: 'DriveOn Blockchain | New Temperature QC Input', tqclist: tqc, baseuri: baseurl });
      }
    });
  } else {
    res.render('errors/500', { message: 'Internel Error, please call system admin!' });
  }
 }

twqcController.edit = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  twqc.findOne({ _id: req.params.id }).exec(function (err, uptqc) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'Data already exists.')
          break;
        default:
          req.flash('alert-danger', "Error on Edit:" + err)
          break;
      }
    } else {
      res.render('tempcontrol/edit', { title: 'DriveOn Blockchain | New Temperature QC Input', tqclist: uptqc, baseuri: baseurl });
    }
  })
 }

twqcController.update = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  twqc.findByIdAndUpdate(
    req.params.id,
    {
      $set:
      {
        placeid: req.body.placeid,
        date: req.body.date,
        time: req.body.time,
        temperature: req.body.temperature,
        unit: req.body.unit,
        colector: req.user.email
      }
    },
    { new: true },
    function (err, profile) {
      if (err) {
        switch (err.code) {
          case 11000:
            req.flash('alert-danger', 'Data already exists.')
            break;
          default:
            req.flash('alert-danger', "Error on update:" + err)
            break;
        }
        res.render("tempcontrol/edit", { title: 'DriveOn Blockchain | New Temperature QC Input', tqclist: req.body, baseuri: baseurl })
      } else {
        res.redirect("/processing/tempcontrol/show/" + profile._id)
      }
    })
 }

twqcController.save = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var pid = req.params.pid;
  var payload = req.body
  var wqc = new twqc(payload)

  wqc.save(function (err) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'Data already exists.')
          break;
        default:
          req.flash('alert-danger', "Error on save:" + err)
          break;
      }
    } else {
      res.redirect('/processing/tempcontrol/show/'+ pid +'/' + wqc._id)
    }
    res.render('tempcontrol/new.jade', { title: 'DriveOn Blockchain | New Temperature QC Input', baseuri: baseurl });
  })
 }

twqcController.delete = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  twqc.remove({ _id: req.params.id }, function (err) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'Data already exists.')
          break;
        default:
          req.flash('alert-danger', "Error on delete:" + err)
          break;
      }
    } else {
      req.flash('alert-info', 'Data deleted!')
      res.redirect("/processing/tempcontrol")
    }
  })
 }

module.exports = twqcController

