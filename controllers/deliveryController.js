// 'use strict';
var mongoose = require('mongoose')
var passport = require('passport')
var Delivery = require('../models/Delivery')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var config = require('../lib/config')
var async = require('run-async')
var upload = require('../routes/upload');
/**
 * CRUD
 */
exports.list = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var _id = req.query.item;
  var limit = 10;
  var options = {
    limit: limit,
    page: page
  };


  Delivery
    .find({}, function (err, documents) {
      Delivery.count().exec(function (err, count) {
        if (count > 0) {
          res.render('delivery/index',
            {
              title: 'DriveOn Blockchain | Deliveries',
              list: documents,
              user_info: req.user,
              baseuri: baseurl,
              page: page + 1,
              pages: Math.ceil(count / limit)
            }
          );
        } else {
          res.render('documents/new.jade', { title: 'DriveOn Blockchain | New File', baseuri: baseurl });
        }
      });
    })
    .limit(limit)
    .skip(limit * page);
};

// exports.confirmation = function (req, res) {
//   var baseurl = req.protocol + "://" + req.get('host') + "/"
//   var page = (req.query.page > 0 ? req.query.page : 1) - 1;
//   var _id = req.query.item;
//   var limit = 10;
//   var options = {
//     limit: limit,
//     page: page
//   };

//   Delivery
//     .find({}, function (err, documents) {
//       Delivery.count().exec(function (err, count) {
//         if (count > 0) {
//           res.render('delivery/confirmation',
//             {
//               title: 'DriveOn Blockchain | Confirmation',
//               list: documents,
//               user_info: req.user,
//               baseuri: baseurl,
//               page: page + 1,
//               pages: Math.ceil(count / limit)
//             }
//           );
//         } else {
//           res.render('documents/new.jade', { title: 'DriveOn Blockchain | New File', baseuri: baseurl });
//         }
//       });
//     })
//     .limit(limit)
//     .skip(limit * page);
// };

exports.confirmation = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  res.render('delivery/confirmation', { title: 'DriveOn Blockchain | New Confirmation', baseuri: baseurl });
};

exports.show = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  if (req.params.id != null || req.params.id != undefined) {
    Delivery.findOne({ _id: req.params.id }).exec(function (err, document) {
      if (err) {
        switch (err.code) {
          case 11000:
            req.flash('alert-danger', 'File already exists.')
            break;
          default:
            req.flash('alert-danger', "Error on Show:" + err)
            break;
        }
      } else {
        req.flash('alert-info', 'Data saved with sucess!')
        res.render('documents/show', { documents: document, baseuri: baseurl });
      }
    });
  } else {
    res.render('errors/500', { message: 'Internal error, please contact system admin.' });
  }
}

exports.edit = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  Delivery.findOne({ _id: req.params.id }).exec(function (err, udocument) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'File already exists.')
          break;
        default:
          req.flash('alert-danger', "Error on edit:" + err)
          break;
      }
    } else {
      res.render('documents/edit', { documents: udocument, baseuri: baseurl });
    }
  });
};

exports.update = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  Delivery.findByIdAndUpdate(
    req.params.id,
    {
      $set:
      {
        documentid: req.body.documentid,
        document_title: req.body.document_title,
        comments: req.body.comments,
        active: req.body.active,
        updatedBy: req.user.email
      }
    },
    { new: true },
    function (err, document) {
      if (err) {
        switch (err.code) {
          case 11000:
            req.flash('alert-danger', 'File already exists.')
            break;
          default:
            req.flash('alert-danger', "Erro on update:" + err)
            break;
        }
        res.render("documents/edit", { documents: req.body, baseuri: baseurl })
      } else {
        req.flash('alert-info', 'Data saved with sucess!')
        res.redirect("/documents/show/" + document._id)
      }
    })
}

exports.save = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  // var payload = req.body

  upload(req, res, (error) => {
    if (error) {
      req.flash('alert-danger', 'Invalid file type. Only JPG, PNG or GIF file are allowed. Detal:' + error)
      res.render('documents/new', { title: 'DriveOn Blockchain | New File', baseuri: baseurl })
    } else {
      if (req.file == undefined) {
        req.flash('alert-danger', 'File size too large.')
        res.render('documents/new', { title: 'DriveOn Blockchain | New File', baseuri: baseurl })
      } else {
        var fullPath = "files/" + req.file.filename;

        var payload = {
          document_title: req.body.document_title,
          comments: req.body.comments,
          path: fullPath,
          document_type: req.file.mimetype,
          modifiedBy: req.user ? req.user.email : ''
        };
        var document = new Delivery(payload)
        document.save(function (err) {
          if (err) {
            console.log('Save err:' + err)
            switch (err.code) {
              case 11000:
                req.flash('alert-danger', 'File already exists.')
                break;
              default:
                req.flash('alert-danger', "Error on save:" + err)
                break;
            }
            res.render('documents/new', { title: 'DriveOn Blockchain | New File', baseuri: baseurl })
          } else {
            req.flash('alert-info', 'Data saved with sucess!')
            res.redirect('/documents/show/' + document._id)
          }
        })
      }
    }
  })


}

exports.delete = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  Delivery.remove({ _id: req.params.id }, function (err) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'File already exists')
          break;
        default:
          req.flash('alert-danger', "Error on delete:" + err)
          break;
      }
    } else {
      req.flash('alert-info', 'File deleted!')
      res.redirect("/documents");
    }
  });
};