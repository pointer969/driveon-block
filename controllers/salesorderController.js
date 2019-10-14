// 'use strict';
var mongoose = require('mongoose')
var passport = require('passport')
var SalesOrder = require('../models/SalesOrder')
var bcrypt = require('bcrypt')
var jwt = require('jsonwebtoken')
var config = require('../lib/config')
var async = require('run-async')
var ExtensiveValue = require('../models/ExtensiveValue')
var ExtensiveClass = require('../models/ExtensiveClass')
var short = require('short-uuid')
var moment = require('moment')
var Customer = require('../models/Customer')
var Driver = require('../models/Driver')
var Vehicle = require('../models/Vehicle')

// Simulate Blockchain data
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);
/**
 * CRUD
 */
exports.list = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  // var _id = req.query.item;
  var limit = 10;
  var options = {
    limit: limit,
    page: page
  };
  var jday = moment().format('Y') + moment().format('DDDD');
  var sotk = getConfiguration('SOAutoRelease') == 'guid' ? short.uuid().toUpperCase() : jday;

  SalesOrder
    .find()
    .populate('customer')
    .populate('vehicle.vehicle')
    .limit(limit)
    .skip(limit * page)
    .exec(function (err, so) {
      // console.log('Err info:'+ err)
      SalesOrder.count().exec(function (err, count) {
        if (count > 0) {
          // console.log('Return=>' + JSON.stringify(so))
          res.render('salesorders/index',
            {
              title: 'Un1ty | Shipping',
              list: so,
              user_info: req.user,
              baseuri: baseurl,
              page: page + 1,
              lotstatus: 'Outgoing',
              nextlot: sotk,
              pages: Math.ceil(count / limit)
            }
          );
        } else {
          Vehicle
            .find({ 'active': true })
            .exec(function (err, vehicle) {
              console.log('Vehicle data=>' + vehicle)
              if (!err) {
                Driver
                  .find({ 'active': true })
                  .exec(function (err, driver) {
                    console.log('Driver data=>' + driver)
                    if (!err) {
                      Customer
                        .find({ 'active': true })
                        .exec(function (err, customer) {
                          // console.log('Customer data=>'+ customer)
                          if (!err) {
                            res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl, lotstatus: 'Outgoing', nextlot: sotk, customers: customer, drivers: driver, vehicles: vehicle });
                          } else {
                            req.flash('alert-danger', 'Fail to get customer data')
                            res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl, lotstatus: 'Outgoing', nextlot: sotk, customers: customer, drivers: driver, vehicles: vehicle });
                          }
                        })
                    } else {
                      req.flash('alert-danger', 'Fail to get driver data')
                      res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl, lotstatus: 'Outgoing', nextlot: sotk, customers: customer, drivers: driver, vehicles: vehicle });
                    }
                  })
              } else {
                req.flash('alert-danger', 'Fail to get vehicle data')
                res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl, lotstatus: 'Outgoing', nextlot: sotk, customers: customer, drivers: driver, vehicles: vehicle });
              }
            })
        }
      });
    })
}

exports.create = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var jday = moment().format('Y') + moment().format('DDDD');
  var sotk = getConfiguration('SOAutoRelease') == 'guid' ? short.uuid().toUpperCase() : jday;

  // res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl });
  Vehicle
      .find({ 'active': true })
      .exec(function (err, vehicle) {
        // console.log('Vehicle data=>' + vehicle)
        if (!err) {
          Driver
            .find({ 'active': true })
            .exec(function (err, driver) {
              // console.log('Driver data=>' + driver)
              if (!err) {
                Customer
                  .find({ 'active': true })
                  .exec(function (err, customer) {
                    // console.log('Customer data=>'+ customer)
                    if (!err) {
                      res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl, lotstatus: 'Outgoing', nextlot: sotk, customers: customer, drivers: driver, vehicles: vehicle });
                    } else {
                      req.flash('alert-danger', 'Fail to get customer data')
                      res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl, lotstatus: 'Outgoing', nextlot: sotk, customers: customer, drivers: driver, vehicles: vehicle });
                    }
                  })
              } else {
                req.flash('alert-danger', 'Fail to get driver data')
                res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl, lotstatus: 'Outgoing', nextlot: sotk, customers: customer, drivers: driver, vehicles: vehicle });
              }
            })
        } else {
          req.flash('alert-danger', 'Fail to get vehicle data')
          res.render('salesorders/new.jade', { title: 'Un1ty | New Shipping', baseuri: baseurl, lotstatus: 'Outgoing', nextlot: sotk, customers: customer, drivers: driver, vehicles: vehicle });
        }
      })
}

exports.show = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  if (req.params.id != null || req.params.id != undefined) {
    SalesOrder.findOne({ _id: req.params.id }).exec(function (err, so) {
      if (err) {
        switch (err.code) {
          case 11000:
            req.flash('alert-danger', 'Sales Order already exists.')
            break;
          default:
            req.flash('alert-danger', "Error on Show:" + err)
            break;
        }
      } else {
        req.flash('alert-info', 'Data saved with sucess!')
        res.render('salesorders/show', { salesorders: so, baseuri: baseurl });
      }
    });
  } else {
    res.render('errors/500', { message: 'Internal error, please contact system admin.' });
  }
}

exports.edit = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  SalesOrder.findOne({ _id: req.params.id }).exec(function (err, uso) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'Sales Order already exists.')
          break;
        default:
          req.flash('alert-danger', "Error on edit:" + err)
          break;
      }
    } else {
      res.render('salesorders/edit', { salesorders: uso, baseuri: baseurl });
    }
  });
}

exports.update = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  SalesOrder.findByIdAndUpdate(
    req.params.id,
    {
      $set:
      {
        so: req.body.so,
        description: req.body.description,
        drivername: req.body.drivername,
        customer: req.body.customer,
        loading_cargo: {
          begin: req.body.udate1,
          end: req.body.udate2
        },
        destination: req.body.destination,
        monitoringBy: req.body.monitoringBy,
        vehicle: {
          vehicle: req.body.vehicle,
          thermoking: req.body.thermoking,
          truckconditions: req.body.truckconditions,
          threshing: req.body.threshing,
          floor: req.body.floor,
          sides: req.body.sides,
          pallets: req.body.pallets,
          rubber: req.body.rubber,
        },
        products: [],
        modifiedBy: req.user.email
      }
    },
    { new: true },
    function (err, so) {
      if (err) {
        switch (err.code) {
          case 11000:
            req.flash('alert-danger', 'Sales Order already exists.')
            break;
          default:
            req.flash('alert-danger', "Erro on update:" + err)
            break;
        }
        res.render("salesorders/edit", { salesorders: req.body, baseuri: baseurl })
      } else {
        req.flash('alert-info', 'Data saved with sucess!')
        res.redirect("/salesorders/show/" + so._id)
      }
    })
}

exports.save = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  const dwork = moment().format()

  console.log('Body=>' + JSON.stringify(req.body))

  var salesorder = new SalesOrder({
    so: req.body.so,
    d_sales: dwork,
    description: req.body.description,
    drivername: req.body.drivername,
    customer: req.body.customer,
    loading_cargo: {
      begin: req.body.utime1,
      end: req.body.utime2
    },
    destination: req.body.destination == 'OTHERS' ? req.body.otherdestination : req.body.destination,
    monitoringBy: req.body.monitoringBy,
    vehicle: {
      vehicle: req.body.plate,
      thermoking: req.body.thermoking,
      truckconditions: req.body.truckconditions,
      threshing: req.body.threshing,
      floor: req.body.floor,
      sides: req.body.sides,
      pallets: req.body.pallets,
      rubber: req.body.rubber,
      temperature: req.body.temperature
    },
    products: req.body.lotlist,
    fiscal: {
      nf: req.body.nf,
      serie: req.body.serie,
      d_nf: req.body.d_nf
    },
    active: true,
    modifiedBy: req.user.email
  })


  salesorder.save(function (err) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'Sales Order already exists.')
          break;
        default:
          req.flash('alert-danger', "Error on save:" + err)
          break;
      }
    } else {
      req.flash('alert-info', 'Data saved with sucess!')
    }
    res.render('salesorders/new', { title: 'Un1ty | New Shipping', baseuri: baseurl })
  })
}

exports.delete = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  SalesOrder.remove({ _id: req.params.id }, function (err) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'Supplier already exists')
          break;
        default:
          req.flash('alert-danger', "Error on delete:" + err)
          break;
      }
    } else {
      req.flash('alert-info', 'Data deleted!')
      res.redirect("/processing/batch/shipping");
    }
  });
};

exports.search = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var criteria = req.params.id

  SalesOrder
    .find({ "so": criteria })
    .exec(function (err, sos) {
      if (!err) {
        var tid = sos[0].id
        var tsono = sos[0].so
        var blockchaintmp = encrypt(tsono)
        var tempmsg = []

        var msg = { 'id': tid, 'so': tsono, 'blockchain': blockchaintmp }
        tempmsg.push(msg)
        // console.log('searchone return:'+tempmsg)
        res.json(tempmsg)
      } else {
        res.json({ 'id': '0', 'so': err, 'blockchain': 'Error' })
      }
    })


}

function getConfiguration(classinfo) {
  ExtensiveClass.findOne({ class: classinfo, active: true })
    .exec(function (err, exclass) {
      if (!err) {
        ExtensiveValue.findOne({ class: exclass._id, active: true })
          .exec(function (err, configs) {
            if (!err) {
              var retValue = configs.value
              return retValue
            } else {
              return 'No Value for Class [' + classinfo + '] set'
            }
          })
      } else {
        return 'No Class [' + classinfo + '] found'
      }
    })


}

function encrypt(text) {
  let cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return { iv: iv.toString('hex'), encryptedData: encrypted.toString('hex') };
}

function decrypt(text) {
  let iv = Buffer.from(text.iv, 'hex');
  let encryptedText = Buffer.from(text.encryptedData, 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(key), iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}   