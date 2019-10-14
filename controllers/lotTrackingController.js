var mongoose = require('mongoose')
var passport = require('passport')
var LotTracking = require('../models/LotTracking')
var moment = require('moment')
var short = require('short-uuid');
var Suppliers = require('../models/Supplier')
var Vehicle = require('../models/Vehicle')



var lotTrackingController = {}

/**
 * CRUD
 */
lotTrackingController.list = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var _id = req.query.item;
  var limit = 10;
  var options = {
    limit: limit,
    page: page
  };

  Suppliers
    .find({}, function (err, suppliers) {
      if (!err) {
        Vehicle.find({}, function (err, vehicles) {
          if (!err) {
            LotTracking
              .find({}, function (err, Lots) {
                LotTracking.count().exec(function (err, count) {
                  if (count > 0) {
                    res.render('lots/position',
                      {
                        title: 'DriveOn Blockchain | Positions',
                        list: Lots,
                        user_info: req.user,
                        suppliers: suppliers,
                        vehicles: vehicles,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)
                      }
                    )
                  } else {
                    res.render('lots/newposition.jade', { title: 'DriveOn Blockchain | Add Position', baseuri: baseurl, suppliers: suppliers, vehicles: vehicles });
                  }
                });
              })
              .limit(limit)
              .skip(limit * page)
          }
        })
      }
    })


}

lotTrackingController.create = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  Suppliers
    .find({}, function (err, suppliers) {
      if (!err) {
        Vehicle.find({}, function (err, vehicles) {
          if (!err) {
            res.render('lots/newposition', { title: 'DriveOn Blockchain | Add Position', baseuri: baseurl, suppliers: suppliers, vehicles: vehicles });
          }
        })
      }
    })

}

lotTrackingController.show = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  if (req.params.id != null || req.params.id != undefined) {
    LotTracking.findOne({ _id: req.params.id }).exec(function (err, lots) {
      if (err) {
        req.flash('alert-danger', "Error on Show:" + err)
      } else {
        req.flash('alert-info', 'Data saved!')
        res.render('lots/showposition', { Lots: lots, baseuri: baseurl });
      }
    });
  } else {
    res.render('errors/500', { message: 'Internal error, please contact system admin!' });
  }
}

lotTrackingController.edit = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  LotTracking.findOne({ _id: req.params.id }).exec(function (err, uprofile) {
    if (err) {
      switch (err.code) {
        case 11000:
          req.flash('alert-danger', 'Data already exists.')
          break;
        default:
          req.flash('alert-danger', "Error on edit:" + err)
          break;
      }
    } else {
      res.render('lots/editposition', { Lots: uprofile, baseuri: baseurl });
    }
  })
}

lotTrackingController.update = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  const dtrack = moment().format()
  const lotkky = short.uuid()

  LotTracking.findByIdAndUpdate(
    req.params.id,
    {
      $set:
      {
        sono: req.body.sono,
        lotkey: lotkky,
        d_track: dwork,
        lat: req.body.lat,
        lon: req.body.lon,
        // vehicle: req.body.vehicle,
        // supplier: req.body.supplier,
        blockchain: req.body.blockchain,
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
        res.render("lots/editposition", { Lots: req.body, baseuri: baseurl })
      } else {
        res.redirect("/processing/positions/show/" + profile._id)
      }
    })
}

lotTrackingController.save = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var payload = req.body

  // console.log('Tracking body=>'+JSON.stringify(payload))

  var lot = new LotTracking(payload)

  lot.save(function (err) {
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
      //   Temporary comments until do not developed CRUD for position
      // res.redirect('/processing/positions/show/'+lot._id)
      req.flash('alert-info', "Data saved with success.")
    }
    Suppliers
      .find({}, function (err, suppliers) {
        if (!err) {
          Vehicle.find({}, function (err, vehicles) {
            if (!err) {
              res.render('lots/newposition', { title: 'DriveOn Blockchain | Add Position', baseuri: baseurl, suppliers: suppliers, vehicles: vehicles });
            }
          })
        }
      })
  })
}

lotTrackingController.delete = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  LotTracking.remove({ _id: req.params.id }, function (err) {
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
      req.flash('alert-info', 'Data removed with success!')
      res.redirect("/processing/positions")
    }
  })
}

lotTrackingController.tracking = function (req, res) {
  var baseurl = req.protocol + "://" + req.get('host') + "/"
  var page = (req.query.page > 0 ? req.query.page : 1) - 1;
  var _id = req.query.item;
  var limit = 10;
  var options = {
    limit: limit,
    page: page
  };

  Suppliers
    .find({}, function (err, suppliers) {
      if (!err) {
        Vehicle.find({}, function (err, vehicles) {
          if (!err) {
            LotTracking
              .find({}, function (err, Lots) {
                LotTracking.count().exec(function (err, count) {
                  res.render('lots/tracking',
                    {
                      title: 'DriveOn Blockchain | Tracking',
                      list: Lots,
                      user_info: req.user,
                      suppliers: suppliers,
                      vehicles: vehicles,
                      baseuri: baseurl,
                      page: page + 1,
                      pages: Math.ceil(count / limit)
                    }
                  );

                });
              })
              .limit(limit)
              .skip(limit * page)
          }
        })
      }
    })


}

lotTrackingController.positions = function (req, res) {
  var _id = req.params.lot;

  //  console.log('Lot to get positions:' + _id);
  LotTracking
    .find({ 'sono': _id }, function (err, Lots) {
      LotTracking.count().exec(function (err, count) {
        var arrayMessage = []
        if (count > 0) {
          for (var i = 0; i < Lots.length; i++) {
            var id = Lots[i]._id
            var lat = Lots[i].lat
            var lon = Lots[i].lon
            // var suppl = Lots[i].supplier
            // var vehicle = Lots[i].vehicle

            // var message0 =  { "_id": id, "lat": lat, "lon": lon, 
            // "supplier": suppl, "vehicle": vehicle }

            var message0 = { "lat": lat, "lng": lon }
            // console.log(message0)
            arrayMessage.push(message0)
          }
        }
        res.json(arrayMessage)
      })
    })

}

module.exports = lotTrackingController

