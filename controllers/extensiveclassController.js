var mongoose = require('mongoose')
var passport = require('passport')
var ExtensiveClass = require('../models/ExtensiveClass')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var config = require('../lib/config')
var async = require('run-async')

var extensiveclassController = {}

/**
 * CRUD
 */
extensiveclassController.list = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var _id = req.query.item;
  var limit = 10;
  var options = {
    limit: limit,
    page: page
  };


  ExtensiveClass
    .find({}, function (err, extensiveclasses) {
      ExtensiveClass.count().exec(function (err, count) {
        if (count > 0) {
          res.render('extensiveclasses/index',
            {
              title: 'DriveOn Blockchain | Extensive Classes',
              list: extensiveclasses,
              user_info: req.user,
              baseuri: baseurl,
              page: page + 1,
              pages: Math.ceil(count / limit)
            }
          );
        } else {
          res.render('extensiveclasses/new.jade', { title: 'DriveOn Blockchain | New Class', baseuri: baseurl });
        }
      });
    })
    .limit(limit)
    .skip(limit * page)
}

extensiveclassController.create = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  res.render('extensiveclasses/new.jade', { title: 'DriveOn Blockchain | New Class', baseuri: baseurl });
}

extensiveclassController.show = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  if (req.params.id != null || req.params.id != undefined) {
    ExtensiveClass.findOne({ _id: req.params.id }).exec(function (err, extclass) {
      if (err) {
        req.flash('alert-danger', "Error on Show:" + err)
      } else {
        req.flash('alert-info', 'Data saved with success.')
        res.render('extensiveclasses/show', { extclasses: extclass, baseuri: baseurl })
      }
    })
  } else {
    res.render('errors/500', { message: 'Internal error, please contact administrator.' })
  }
}

extensiveclassController.edit = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  ExtensiveClass.findOne({ _id: req.params.id }).exec(function (err, uprofile) {
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
      res.render('extensiveclasses/edit', { extclasses: uprofile, baseuri: baseurl });
    }
  })
}

extensiveclassController.update = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  ExtensiveClass.findByIdAndUpdate(
    req.params.id,
    {
      $set:
      {
        class: req.body.class,
        description: req.body.description,
        rate: req.body.rate,
        active: req.body.active,
        modifiedBy: req.user.email
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
        res.render("extensiveclasses/edit", { extensiveclasses: req.body, baseuri: baseurl })
      } else {
        // req.flash('alert-info', 'Dados salvos com sucesso!')            
        res.redirect("/extclasses/show/" + profile._id)
      }
    })
}

extensiveclassController.save = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var payload = req.body

  if (req.user) {
    // console.log('Check req.user data:'+ JSON.stringify(req.user))
    payload.modifiedBy = req.user.email
  }

  var extclass = new ExtensiveClass(payload)

  extclass.save(function (err) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'Data already exists.')
          break;
        default:
          req.flash('alert-danger', "Error on save:" + err)
          break;
      }
      res.render('extensiveclasses/new.jade', { title: 'DriveOn Blockchain | New Class', baseuri: baseurl })
    } else {
      res.redirect('/extclasses/show/' + extclass._id)
    }
    res.render('extensiveclasses/new.jade', { title: 'DriveOn Blockchain | New Class', baseuri: baseurl })
  })
}

extensiveclassController.delete = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  ExtensiveClass.remove({ _id: req.params.id }, function (err) {
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
      req.flash('alert-info', 'Data removed with sucess!')
      res.redirect("/extclasses");
    }
  })
}

module.exports = extensiveclassController  