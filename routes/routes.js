var express         = require('express')
var router          = express.Router()
var user            = require('../controllers/userController')
var masterdata      = require('../controllers/masterController')
var message         = require("../controllers/messageController")
// var currtripinfo    = require("../controllers/currenttripinfoController")
var devices         = require("../controllers/deviceController")
var vehicles        = require("../controllers/vehicleController")
var authority       = require("../controllers/authorityController")
var profile         = require("../controllers/profileController")
var customer        = require("../controllers/customerController")
var carval          =  require("../controllers/calcvarController")
var product         =  require("../controllers/productController")
var eclass          =  require("../controllers/extensiveclassController")
var evalo           =  require("../controllers/extensivevalueController")
var drivebahavior   = require('../controllers/drivebehaviorController')
var pwqc            = require('../controllers/ProcessingWaterQC')
var twqc            = require('../controllers/ProcessingTemperatureQC')
var lot             = require('../controllers/lotController')
var supplier        = require('../controllers/supplierController')
var driver          = require('../controllers/driverController')
var documents       = require('../controllers/documentController')
var lottracking     = require('../controllers/lotTrackingController')
var salesorder     = require('../controllers/salesorderController')
var delivery      = require('../controllers/deliveryController')
var report = require('../controllers/reportController')

// route to login page
router.get('/login', user.login);

// route for login action
router.post('/login', user.doLogin);

// route for logout action
router.get('/logout', user.logout);

// route to register page
router.get('/register', user.register);

// route for register action
router.post('/register', user.doRegister);


router.get('/', require('permission')(), isLoggedIn, masterdata.list)
router.get('/receive/tag', require('permission')(['administrador','producer','processing']), isLoggedIn, masterdata.carlist)


router.get('/alarms', require('permission')(['administrador','segurado']), isLoggedIn, vehicles.listbyUser)
router.post('/alarms/timeline/:device', isLoggedIn, message.getAlarm)
router.get('/analytics', require('permission')(['administrador','segurado']), isLoggedIn, vehicles.analyticsbyUser)
router.post('/getvoltage/:id', isLoggedIn, message.getVoltage)
// router.post('/getDuration/:id', isLoggedIn, message.getDurationbyUser)

// Locates
router.get('/message/gps/:id',  message.getgeo)
router.get('/message/gpslist/:id',  message.getgeolist)



// Dashboard
// Top 1
// router.post('/cntTripByDay/:customer', isLoggedIn, currtripinfo.sumTripMileage)
// router.post('/chartMileageMonth', isLoggedIn, currtripinfo.chartTripMileage)
// // // Top 2
// router.post('/cntIdleTime', isLoggedIn,  currtripinfo.sumIdleEngineTime)
// router.post('/chartIdleTime', isLoggedIn,  currtripinfo.chartIdleEngineTime)
// // // Top 3
// router.post('/cntHACCOccur', isLoggedIn, currtripinfo.cntHarshAcc)
// router.post('/chartHACCOccur', isLoggedIn, currtripinfo.chartHarshAcc)
// // // Top 4
// router.post('/cntHBRAKEOccur', isLoggedIn,  currtripinfo.cntHarshBrake)
// router.post('/chartHBRAKEOccur', isLoggedIn,  currtripinfo.chartHarshBrake)


// / // From Index Monthly Grid
router.post('/cntDevConnected/:customer', isLoggedIn, devices.connecteds)
router.post('/cntDevDisconnected/:customer', isLoggedIn, devices.disconneteds)
router.post('/cntSOS', isLoggedIn, message.SOSCounter)
router.post('/cntReb', isLoggedIn, message.GuinchoCounter)
router.post('/cntMIL', isLoggedIn, message.MILCounter)
router.post('/sumGAS', isLoggedIn, message.GASsum)




// --------------------------------------------------------------------------------
// Drive Behavior
// router.get('/driverbehavior', require('permission')(['administrador','segurado']), isLoggedIn, drivebahavior.list)
router.get('/driverbehavior', isLoggedIn, drivebahavior.list)
router.get('/chartScoreEvolution', isLoggedIn, drivebahavior.scorehistory)
router.get('/timeline', isLoggedIn, drivebahavior.timeline)
// router.get('/scorerun',  drivebahavior.scorestub)

 // ++++++++++++++++++++++ Users CRUD +++++++++++++++++++++++++++
// List all Users
router.get('/users', require('permission')(['administrador','seguradora']),isLoggedIn,  user.list)
// Get single user by id
router.get('/users/show/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  user.show)
// Create user
router.get('/users/new', require('permission')(['administrador','seguradora']),isLoggedIn, user.create)
// Save user
router.post('/users/save', require('permission')(['administrador','seguradora']), isLoggedIn, user.save)
// Edit user
router.get('/users/edit/:id', require('permission')(['administrador','seguradora']), isLoggedIn,  user.edit)
// Edit user
router.post('/users/update/:id', require('permission')(['administrador','seguradora']), isLoggedIn, user.update)
// Delete
router.post('/users/delete/:id', require('permission')(['administrador','seguradora']), isLoggedIn, user.delete)

// ++++++++++++++++++++++ Authority CRUD+++++++++++++++++++++++++++

router.get('/authorities', require('permission')(['administrador','seguradora']), isLoggedIn,  authority.list)

router.get('/authorities/show/:id', require('permission')(['administrador','seguradora']), isLoggedIn, authority.show)

router.get('/authorities/new', require('permission')(['administrador','seguradora']),isLoggedIn, authority.create)

router.post('/authorities/save', require('permission')(['administrador','seguradora']),isLoggedIn, authority.save)

router.get('/authorities/edit/:id', require('permission')(['administrador','seguradora']),isLoggedIn, authority.edit)

router.post('/authorities/update/:id', require('permission')(['administrador','seguradora']),isLoggedIn, authority.update)

router.post('/authorities/delete/:id', require('permission')(['administrador','seguradora']),isLoggedIn, authority.delete)

// // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Profile +++++++++++++++++++++++++++

router.get('/profiles', require('permission')(['administrador','seguradora']),isLoggedIn,  profile.list)

router.get('/profiles/show/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  profile.show)

router.get('/profiles/new', require('permission')(['administrador','seguradora']),isLoggedIn, profile.create)

router.post('/profiles/save', require('permission')(['administrador','seguradora']),isLoggedIn,  profile.save)

router.get('/profiles/edit/:id',  require('permission')(['administrador','seguradora']),isLoggedIn, profile.edit)

router.post('/profiles/update/:id', require('permission')(['administrador','seguradora']),isLoggedIn, profile.update)

router.post('/profiles/delete/:id', require('permission')(['administrador','seguradora']),isLoggedIn, profile.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 // ++++++++++++++++++++++ customer +++++++++++++++++++++++++++

router.get('/customers', require('permission')(['administrador','seguradora']), isLoggedIn, customer.list)
// Get single user by id
router.get('/customers/show/:id', require('permission')(['administrador','seguradora']),isLoggedIn, customer.show)
// Create user
router.get('/customers/new',require('permission')(['administrador','seguradora']), isLoggedIn, customer.create)
// Save user
router.post('/customers/save', require('permission')(['administrador','seguradora']),isLoggedIn, customer.save)
// Edit user
router.get('/customers/edit/:id', require('permission')(['administrador','seguradora']),isLoggedIn, customer.edit)
// Edit user
router.post('/customers/update/:id',require('permission')(['administrador','seguradora']),isLoggedIn,  customer.update)
// Delete
router.post('/customers/delete/:id', require('permission')(['administrador','seguradora']),isLoggedIn, customer.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Devices +++++++++++++++++++++++++++
// List all devices
router.get('/devices', require('permission')(['administrador','seguradora']),isLoggedIn, devices.list)
// Get single device by id
router.get('/devices/show/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  devices.show)
// Create device
router.get('/devices/new', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.create)
// Save device
router.post('/devices/save', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.save)
// Edit device
router.get('/devices/edit/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  devices.edit)
// Edit device
router.post('/devices/update/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.update)
// Delete
router.post('/devices/delete/:id', require('permission')(['administrador','seguradora']),isLoggedIn, devices.delete)

router.get('/devices/setup', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.setuplist)

router.get('/devices/sendcmd/:id', require('permission')(['administrador','seguradora']),isLoggedIn,  devices.callttvapi)


// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// / ++++++++++++++++++++++ Vehicle +++++++++++++++++++++++++++

router.get('/vehicles',require('permission')(['administrador','seguradora']), isLoggedIn,  vehicles.list)

router.get('/vehicles/show/:id',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.show)

router.get('/vehicles/new',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.create)

router.post('/vehicles/save',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.save)

router.get('/vehicles/edit/:id',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.edit)

router.post('/vehicles/update/:id',require('permission')(['administrador','seguradora']), isLoggedIn, vehicles.update)

router.post('/vehicles/delete/:id',require('permission')(['administrador','seguradora']), isLoggedIn,  vehicles.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
   // ++++++++++++++++++++++ Variables +++++++++++++++++++++++++++
// List all Users
router.get('/calcvars',require('permission')(['administrador','seguradora']), isLoggedIn,  carval.list)
// Get single user by id
router.get('/calcvars/show/:id',require('permission')(['administrador','seguradora']),isLoggedIn,  carval.show)
// Create user
router.get('/calcvars/new',require('permission')(['administrador','seguradora']),isLoggedIn,  carval.create)
// Save user
router.post('/calcvars/save',require('permission')(['administrador','seguradora']), isLoggedIn, carval.save)
// Edit user
router.get('/calcvars/edit/:id',require('permission')(['administrador','seguradora']),isLoggedIn,  carval.edit)
// Edit user
router.post('/calcvars/update/:id',require('permission')(['administrador','seguradora']), isLoggedIn, carval.update)
// Delete
router.post('/calcvars/delete/:id',require('permission')(['administrador','seguradora']), isLoggedIn, carval.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Products +++++++++++++++++++++++++++
// List all georisk
router.get('/products',require('permission')(['administrador','processing']), isLoggedIn, product.list)
// Get single georisk by id
router.get('/products/show/:id',require('permission')(['administrador','processing']), isLoggedIn,  product.show)
// Create georisk
router.get('/products/new', require('permission')(['administrador','processing']),isLoggedIn,  product.create)
// Save georisk
router.post('/products/save',require('permission')(['administrador','processing']), isLoggedIn,  product.save)
// Edit georisk
router.get('/products/edit/:id',require('permission')(['administrador','processing']), isLoggedIn,  product.edit)
// Edit georisk
router.post('/products/update/:id',require('permission')(['administrador','processing']), isLoggedIn,  product.update)
// Delete
router.post('/products/delete/:id',require('permission')(['administrador','processing']), isLoggedIn, product.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// / ++++++++++++++++++++++ Ext. Classes +++++++++++++++++++++++++++
// List all ECLASS
router.get('/extclasses', require('permission')(['administrador','processing']),isLoggedIn, eclass.list)
// Get single ECLASS by id
router.get('/extclasses/show/:id', require('permission')(['administrador','processing']),isLoggedIn,  eclass.show)
// Create ECLASS
router.get('/extclasses/new', require('permission')(['administrador','processing']),isLoggedIn,  eclass.create)
// Save ECLASS
router.post('/extclasses/save', require('permission')(['administrador','processing']),isLoggedIn,  eclass.save)
// Edit ECLASS
router.get('/extclasses/edit/:id', require('permission')(['administrador','processing']),isLoggedIn,  eclass.edit)
// Edit ECLASS
router.post('/extclasses/update/:id',require('permission')(['administrador','processing']), isLoggedIn,  eclass.update)
// Delete
router.post('/extclasses/delete/:id',require('permission')(['administrador','processing']), isLoggedIn, eclass.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Ext. Value +++++++++++++++++++++++++++
// List all EVALUE
router.get('/extensivevalues',require('permission')(['administrador','processing']), isLoggedIn, evalo.list)
// Get single EVALUE by id
router.get('/extensivevalues/show/:id',require('permission')(['administrador','processing']), isLoggedIn,  evalo.show)
// Create EVALUE
router.get('/extensivevalues/new',require('permission')(['administrador','processing']), isLoggedIn,  evalo.create)
// Save EVALUE
router.post('/extensivevalues/save',require('permission')(['administrador','processing']), isLoggedIn,  evalo.save)
// Edit EVALUE
router.get('/extensivevalues/edit/:id',require('permission')(['administrador','processing']), isLoggedIn,  evalo.edit)
// Edit EVALUE
router.post('/extensivevalues/update/:id',require('permission')(['administrador','processing']), isLoggedIn,  evalo.update)
// Delete
router.post('/extensivevalues/delete/:id',require('permission')(['administrador','processing']), isLoggedIn, evalo.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// ++++++++++++++++++++++ Water Quality Control +++++++++++++++++++++++++++

router.get('/processing/watercontrol', require('permission')(['administrador','processing']), isLoggedIn, pwqc.list)
// Get single user by id
router.get('/processing/watercontrol/show/:id', require('permission')(['administrador','processing']),isLoggedIn, pwqc.show)
// Create user
router.get('/processing/watercontrol/new',require('permission')(['administrador','processing']), isLoggedIn, pwqc.create)
// Save user
router.post('/processing/watercontrol/save', require('permission')(['administrador','processing']),isLoggedIn, pwqc.save)
// Edit user
router.get('/processing/watercontrol/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, pwqc.edit)
// Edit user
router.post('/processing/watercontrol/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  pwqc.update)
// Delete
router.post('/processing/watercontrol/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, pwqc.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Batch +++++++++++++++++++++++++++

router.get('/processing/batch/shipping', require('permission')(['administrador','processing']), isLoggedIn, salesorder.list)
// Get single user by id
router.get('/processing/batch/shipping/show/:id', require('permission')(['administrador','processing']),isLoggedIn, salesorder.show)
// Create user
router.get('/processing/batch/shipping/new',require('permission')(['administrador','processing']), isLoggedIn, salesorder.create)
// Save user
router.post('/processing/batch/shipping/save', require('permission')(['administrador','processing']),isLoggedIn, salesorder.save)
// Edit user
router.get('/processing/batch/shipping/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, salesorder.edit)
// Edit user
router.post('/processing/batch/shipping/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  salesorder.update)
// Delete
router.post('/processing/batch/shipping/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, salesorder.delete)

// Get single tracking by id
router.get('/processing/batch/shipping/search/:id', require('permission')(['administrador','processing']),isLoggedIn, salesorder.search)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++


// ++++++++++++++++++++++ Temperature Quality Control +++++++++++++++++++++++++++

router.get('/processing/tempcontrol/:pid', require('permission')(['administrador','processing']), isLoggedIn, twqc.list)
// Get single user by id
router.get('/processing/tempcontrol/show/:pid/:id', require('permission')(['administrador','processing']),isLoggedIn, twqc.show)
// Create user
router.get('/processing/tempcontrol/new/:pid',require('permission')(['administrador','processing']), isLoggedIn, twqc.create)
// Save user
router.post('/processing/tempcontrol/save/:pid', require('permission')(['administrador','processing']),isLoggedIn, twqc.save)
// Edit user
router.get('/processing/tempcontrol/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, twqc.edit)
// Edit user
router.post('/processing/tempcontrol/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  twqc.update)
// Delete
router.post('/processing/tempcontrol/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, twqc.delete)

// ++++++++++++++++++++++ Temperature Quality Control for Others phases +++++++++++++++++++++++++++

router.get('/receive/tempcontrol/:pid', require('permission')(['administrador','processing']), isLoggedIn, twqc.list)

router.get('/storage/tempcontrol/:pid', require('permission')(['administrador','processing']), isLoggedIn, twqc.list)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Lot +++++++++++++++++++++++++++

router.get('/lots/stock/:id', require('permission')(['administrador','processing']), isLoggedIn, lot.getLotStock)

router.get('/tagapp/lots', require('permission')(['administrador','processing']), isLoggedIn, lot.search)

router.post('/tagapp/lots/save', require('permission')(['administrador','processing']), isLoggedIn, lot.saveiqc)

router.get('/receive/manual', require('permission')(['administrador','processing']), isLoggedIn, lot.manual)

router.get('/receive/offflavorqc', require('permission')(['administrador','processing']), isLoggedIn, lot.offflavor)

router.post('/receive/offflavor/save', require('permission')(['administrador','processing']), isLoggedIn, lot.saveoffflavor)

router.get('/lots/search/:id', require('permission')(['administrador','processing']),isLoggedIn, lot.searchone)
// Get single user by id
router.get('/lots/show/:id', require('permission')(['administrador','processing']),isLoggedIn, lot.show)
// Create user
router.get('/lots/new',require('permission')(['administrador','processing']), isLoggedIn, lot.create)
// Save user
router.post('/lots/save', require('permission')(['administrador','processing']),isLoggedIn, lot.save)
// Edit user
router.get('/lots/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, lot.edit)
// Edit user
router.post('/lots/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  lot.update)
// Delete
router.post('/lots/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, lot.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Temperature Quality Control +++++++++++++++++++++++++++

router.get('/suppliers', require('permission')(['administrador','processing']), isLoggedIn, supplier.list)
// Get single user by id
router.get('/suppliers/show/:id', require('permission')(['administrador','processing']),isLoggedIn, supplier.show)
// Create user
router.get('/suppliers/new',require('permission')(['administrador','processing']), isLoggedIn, supplier.create)
// Save user
router.post('/suppliers/save', require('permission')(['administrador','processing']),isLoggedIn, supplier.save)
// Edit user
router.get('/suppliers/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, supplier.edit)
// Edit user
router.post('/suppliers/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  supplier.update)
// Delete
router.post('/suppliers/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, supplier.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Drivers +++++++++++++++++++++++++++

router.get('/drivers', require('permission')(['administrador','processing']), isLoggedIn, driver.list)
// Get single user by id
router.get('/drivers/show/:id', require('permission')(['administrador','processing']),isLoggedIn, driver.show)
// Create user
router.get('/drivers/new',require('permission')(['administrador','processing']), isLoggedIn, driver.create)
// Save user
router.post('/drivers/save', require('permission')(['administrador','processing']),isLoggedIn, driver.save)
// Edit user
router.get('/drivers/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, driver.edit)
// Edit user
router.post('/drivers/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  driver.update)
// Delete
router.post('/drivers/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, driver.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Documents +++++++++++++++++++++++++++

router.get('/documents', require('permission')(['administrador','processing']), isLoggedIn, documents.list)
// Get single user by id
router.get('/documents/show/:id', require('permission')(['administrador','processing']),isLoggedIn, documents.show)
// Create user
router.get('/documents/new',require('permission')(['administrador','processing']), isLoggedIn, documents.create)
// Save user
router.post('/documents/save', require('permission')(['administrador','processing']),isLoggedIn, documents.save)
// Edit user
router.get('/documents/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, documents.edit)
// Edit user
router.post('/documents/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  documents.update)
// Delete
router.post('/documents/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, documents.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Delivery +++++++++++++++++++++++++++

router.get('/delivery/confirmation', require('permission')(['administrador','processing']), isLoggedIn, delivery.confirmation)
// Get single user by id
// router.get('/documents/show/:id', require('permission')(['administrador','processing']),isLoggedIn, documents.show)
// // Create user
// router.get('/documents/new',require('permission')(['administrador','processing']), isLoggedIn, documents.create)
// // Save user
// router.post('/documents/save', require('permission')(['administrador','processing']),isLoggedIn, documents.save)
// // Edit user
// router.get('/documents/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, documents.edit)
// // Edit user
// router.post('/documents/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  documents.update)
// // Delete
// router.post('/documents/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, documents.delete)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

// ++++++++++++++++++++++ Tracking - Positions +++++++++++++++++++++++++++

router.get('/processing/positions', require('permission')(['administrador','processing']), isLoggedIn, lottracking.list)

router.get('/processing/tracking', require('permission')(['administrador','processing']), isLoggedIn, lottracking.tracking)

router.get('/processing/tracking/show/:lot', require('permission')(['administrador','processing']), isLoggedIn, lottracking.positions)

// Get single user by id
router.get('/processing/positions/show/:id', require('permission')(['administrador','processing']),isLoggedIn, lottracking.show)
// Create user
router.get('/processing/positions/new',require('permission')(['administrador','processing']), isLoggedIn, lottracking.create)
// Save user
router.post('/processing/positions/save', require('permission')(['administrador','processing']),isLoggedIn, lottracking.save)
// Edit user
router.get('/processing/positions/edit/:id', require('permission')(['administrador','processing']),isLoggedIn, lottracking.edit)
// Edit user
router.post('/processing/positions/update/:id',require('permission')(['administrador','processing']),isLoggedIn,  lottracking.update)
// Delete
router.post('/processing/positions/delete/:id', require('permission')(['administrador','processing']),isLoggedIn, lottracking.delete)

// ++++++++++++++++++++++ Stock - Confirmation - Good Reception +++++++++++++++++++++++++++
router.get('/processing/goods/confirmation', require('permission')(['administrador','processing']), isLoggedIn, lot.confirmation)
// Save Good Receive
router.post('/processing/confirmation/save', require('permission')(['administrador','processing']),isLoggedIn, lot.goodreceiveconfirmation)



// +++++++++++++++++++++++++++++++++ [Pivot] +++++++++++++++++++++++++++++++++++++++++++++++++

// View Pivot
router.get('/report/pivot', require('permission')(['administrador','processing']), isLoggedIn, report.pivot)
// View Lots
router.get('/report/pivot/lot',require('permission')(['administrador','processing']), isLoggedIn, report.lots)
// ++++++++++++++++++++++ Errors +++++++++++++++++++++++++++
router.get('/errors/403', function(req, res) {
    res.render('errors/403');
  });

module.exports = router

function isLoggedIn(req, res, next) {            
        if (req.isAuthenticated())        
            return next();
    
        res.redirect('/login');
    }