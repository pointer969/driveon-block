var mongoose        = require('mongoose')
var passport        = require('passport')
var Lot             = require('../models/Lot')
var Driver          = require('../models/Driver')
var moment          = require('moment')
var short           = require('short-uuid')
var Product         = require('../models/Product')
var Vehicle         = require('../models/Vehicle')
var Supplier        = require('../models/Supplier')
var ExtensiveValue       = require('../models/ExtensiveValue')
var ExtensiveClass       = require('../models/ExtensiveClass')
var SalesOder             = require('../models/SalesOrder')
var LotStock              = require('../models/LotStock')
// Simulate Blockchain data
const crypto = require('crypto');
const algorithm = 'aes-256-cbc';
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

var lotController = {}

/**
 * CRUD
 */ 
lotController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };


    Lot
        .find({}, function(err, Lots){
          Lot.count().exec(function(err, count){
              if (count > 0) {
                    res.render('lots/income',
                    { title: 'DriveOn Blockchain | Receive by TAG (Lakes)', 
                        list: Lots,
                        user_info: req.user,
                        baseuri: baseurl,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    res.render('lots/new.jade', { title: 'DriveOn Blockchain | Receive by Manual (Lakes)',baseuri:baseurl});
                  }     
            });        
        })        
        .limit(limit)
        .skip(limit * page)
  }

lotController.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    res.render('lots/new.jade', { title: 'DriveOn Blockchain | Lot creation',baseuri:baseurl});
 }   
 
lotController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {      
  Lot.findOne({_id: req.params.id}).exec(function (err, lots) {
        if (err) {         
          req.flash('alert-danger', "Error on Show:"+ err)                
        } else {     
          req.flash('alert-info', 'Data saved!')       
          res.render('lots/show', {Lots: lots, baseuri:baseurl});
        }
      });
  } else {    
    res.render('errors/500', {message:'Internal error, please contact system admin!'});    
  }
 }    

lotController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"    
  Lot.findOne({_id: req.params.id}).exec(function (err, uprofile) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Data already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on edit:"+ err)  
                 break;
          }   
        } else {          
          res.render('lots/edit', {Lots: uprofile, baseuri:baseurl});
        }
      })
 }

lotController.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"  
    const dwork = moment().format()  
    Lot.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                lotno 	:req.body.lotno,
                lotkey   :req.body.lotkey,
                d_work : dwork,
                description     :req.body.description,
                tank    :req.body.tank,
                product     :req.body.product, 
                active:req.body.active,
                modifiedBy: req.user.email
              }
          }, 
          { new: true }, 
   function (err, profile) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Data already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on update:"+ err)  
                 break;
          }   
          res.render("lots/edit", {Lots: req.body, baseuri:baseurl})
        }else{           
          res.redirect("/lots/show/"+profile._id)
        }
      })
 }  

lotController.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    const dwork = moment().format() 
      // console.log('Body=>' + JSON.stringify(req.body))

    var lot = new Lot({
      lotno : req.body.lotno,
      lotkey : '',
      serials: req.body.seriallist,
      d_work : dwork,
      description : req.body.description,
      tank : req.body.tanknumber,
      product : req.body.product,
      supplier : req.body.suppliernm,
      status : 'Initial',
      events : {
        process : 'Receive',
        dlog : dwork,
        species : req.body.species,
        drivername : req.body.drivername,
        plate : req.body.plate,
        supplier_source : req.body.supplier_source,
        supplier : req.body.supplier,
        expediture_date : req.body.expdate,
        cargo_type: req.body.cargotype,
        sanity_codition : req.body.sanitybexpedit,
        cropdays: req.body.cropdays,
        watertemp : req.body.watertemp,
        tanknumber : req.body.tanknumber,
        food : req.body.food,
        weigth : req.body.weigth,
        boxqty : req.body.boxqty,
        fingerlingssource : req.body.fingerlingssource,
        sourcelot : req.body.sourcelot,
        treats : req.body.treats,
        fasting : req.body.fasting,
        croptype: req.body.croptype,
        expedituresatisfactory: req.body.expedituresatisfactory,
        despescaconditions : req.body.despescaconditions,
        despescaconditionsdrugs : req.body.despescaconditionsdrugs,
        graceperiod : req.body.graceperiod,
        utilization_period: {
            begin: req.body.udate1,
            end: req.body.udate2
        },
        mortalityrate : req.body.mortalityrate,
        dissolvedoxygen : req.body.dissolvedoxygen,
        animaltransitguide: req.body.animaltransitguide
      },
      modifiedBy: req.user.email,
      active : true
    })

    lot.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Data already exists.')    
               break;        
           default: 
               req.flash('alert-danger', "Error on save:"+ err)  
               break;
        } 
      } else {          
        // res.redirect('/lots/show/'+lot._id)
        req.flash('alert-info', 'Lot [' + lot.lotno + '] created with success!')  
        res.redirect('/receive/manual')
      }
      res.render('lots/manual.jade', { title: 'DriveOn Blockchain | New Lot', baseuri:baseurl});
    })
 }

lotController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Lot.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Data already exists.')    
                break;        
            default: 
                req.flash('alert-danger', "Error on delete:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Data removed with success!')        
          res.redirect("/lots")
        }
      })
  }


lotController.search = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
        res.render('lots/income',
        { title: 'DriveOn Blockchain | Incomming QC (Lakes)',             
            user_info: req.user,
            baseuri: baseurl
          });
                  
  }  


lotController.manual = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var jday = moment().format('Y') + moment().format('DDDD');
    var lotk = getLotNoConfiguration ()=='guid' ? short.uuid().toUpperCase():jday;
  Supplier
    .find({},function(err,supplier){
      if(!err){
      Vehicle
      .find({},function(err, vehicle){
        if(!err){
          Driver
            .find({},function(err, driver){
              if(!err){
                Product  
                .find({},function(err,product){
                  if(!err){
                    Lot.count().exec(function(err, count){
                      var cnt = count+1;
                        res.render('lots/manual',
                        { title: 'DriveOn Blockchain | Receive by Manual (Lakes)',             
                            user_info: req.user,
                            baseuri: baseurl,
                            products: product,
                            drivers: driver,
                            vehicles: vehicle,
                            suppliers: supplier,
                            lotstatus:'Initial',
                            nextlot: lotk 
                          });
                    });  
                  }
                })
              }        
            }) 
        }
      })
      }
    })
    
              
  }  

lotController.offflavor = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
        res.render('lots/offflavor',
        { title: 'DriveOn Blockchain | Off-Flavor Quality Control (Lakes)',             
            user_info: req.user,
            baseuri: baseurl
          });
                  
  }  

lotController.saveoffflavor = function(req, res) {   
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  const dwork = moment().format() 
 
  Lot.findByIdAndUpdate(
        req.body.lotid,          
        { $set: 
            { 
              status : 'Received',
              events : {
                process : 'Off-Flavor',
                flavorcheck:{
                  d_insp_d : dwork,
                  weigth : req.body.medias,
                  offflavor : req.body.offflavor
                } 
              },
              active:req.body.active,
              modifiedBy: req.user.email
            }
        }, 
        { new: true }, 
    function (err, lot) {                                                              
      if (err) {         
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Data already exists.')    
               break;        
           default: 
               req.flash('alert-danger', "Error on update:"+ err)  
               break;
        }           
      }else{           
        req.flash('alert-info', 'Lot [' + lot.lotno + '] updated with success!')  
      }
      res.render('lots/offflavor',
        { title: 'DriveOn Blockchain | Off-Flavor Quality Control (Lakes)',             
            user_info: req.user,
            baseuri: baseurl
          });
    })
                  
  }    
 
  lotController.saveiqc = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    const dwork = moment().format() 
   
    Lot.findByIdAndUpdate(
          req.body.lotid,          
          { $set: 
              { 
                status : 'Received',
                events : {
                  process : 'IQC',
                  iqc:{
                    eyes : req.body.eyes,
                    qcyescomments : req.body.qcyescomments,
                    gills : req.body.gills,
                    qcgillscomments : req.body.qcgillscomments,
                    belly: req.body.belly,
                    qcbellycomments : req.body.qcbellycomments,
                    scales: req.body.scales,
                    qcscalescomments : req.body.qcscalescomments,
                    qcactions: {
                        nonreport: req.body.nonreport,
                        qcaction: req.body.qcaction,
                        qcverification: req.body.qcverification,
                        qcprevent: req.body.qcprevent
                    }
                  } 
                },
                modifiedBy: req.user.email
              }
          }, 
          { new: true }, 
      function (err, lot) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Data already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on update:"+ err)  
                 break;
          }           
        }else{           
          req.flash('alert-info', 'Lot [' + lot.lotno + '] updated with success!')  
        }
        res.render('lots/income',
          { title: 'DriveOn Blockchain | Incomming QC (Lakes)',             
              user_info: req.user,
              baseuri: baseurl
            });
      })
                    
  }  
  
 lotController.searchone = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var criteria = req.params.id
    
    Lot
      .find({"lotno": criteria})
      .exec(function(err, lots){ 
        if(!err){
          var tid   = lots[0].id
          var tlotno = lots[0].lotno
          var blockchaintmp = encrypt(tlotno) 
          var tproduct = lots[0].product
          var ttank = lots[0].tank
          var tempmsg = []
          var tdescription = getProductDescription(tproduct)        

          var msg = {'id': tid,'lotno': tlotno, 'blockchain' :  blockchaintmp,
                      'product': tproduct,'description': tdescription, 'tank': ttank}
          tempmsg.push(msg)
          // console.log('searchone return:'+tempmsg)
          res.json(tempmsg)
        }
      })
                  
  }

lotController.getLotStock = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var criteria = req.params.id
         
      Lot
        .find({"lotno": criteria})
        .exec(function(err, lots){ 
          if(!err){
            var tid = lots[0].id
            var tlot = lots[0].lotno
            var tproduct = lots[0].product
            var tdescription = getProductDescription(tproduct)        

            // Code Stub for initial stock 
            // var initialStock = new LotStock({
            //     lotno: tid,
            //     q_in : 10,
            //     q_out:0,
            //     active: true
            // }) 

            // initialStock.save(function(err) {
            //   console.log('Error on Stub Stock:'+ err)
            // }) 
        
            LotStock
            .find({'active': true, 'lotno': tid})
            .exec(function(err, stock){
              if (!err) {
                var tempmsg = []  
                var qty = 0            
                for(var i=0;i<stock.length;i++){
                  var qbal = stock[i].q_in - stock[i].q_out
                  qty =+ qbal
                }
                
                var msg = {'id': tid,'lotno': tlot, 
                            'product': tproduct,'description': tdescription, 'qty': qty}
                
              }else{
                var msg = {'id': tid,'lotno': tlot, 
                            'product': 'Error','description': 'Error', 'qty': 0}
                
              }
              tempmsg.push(msg)
              // console.log('searchone return:'+tempmsg)
              res.json(tempmsg)
            })            
          }
        })        
  }   


lotController.outcome = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var jday = moment().format('Y') + moment().format('DDDD');
    var lotk = getLotNoConfiguration ()=='guid' ? short.uuid().toUpperCase():jday;
  Supplier
    .find({},function(err,supplier){
      if(!err){
      Vehicle
      .find({},function(err, vehicle){
        if(!err){
          Driver
            .find({},function(err, driver){
              if(!err){
                Product  
                .find({},function(err,product){
                  if(!err){
                    Lot.count().exec(function(err, count){
                      var cnt = count+1;
                        res.render('lots/outcome',
                        { title: 'DriveOn Blockchain | Shipping  (Lakes)',             
                            user_info: req.user,
                            baseuri: baseurl,
                            products: product,
                            drivers: driver,
                            vehicles: vehicle,
                            suppliers: supplier,
                            lotstatus:'Outgoing',
                            nextlot: lotk 
                          });
                    });  
                  }
                })
              }        
            }) 
        }
      })
      }
    })
                  
  }  


lotController.shipping  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    const dwork = moment().format() 
      // console.log('Body=>' + JSON.stringify(req.body))

    var lot = new Lot({
      lotno : req.body.lotno,
      lotkey : '',
      serials: req.body.seriallist,
      d_work : dwork,
      description : req.body.description,
      tank : req.body.tanknumber,
      product : req.body.product,
      supplier : req.body.suppliernm,
      status : 'Initial',
      events : {
        process : 'Receive',
        dlog : dwork,
        species : req.body.species,
        drivername : req.body.drivername,
        plate : req.body.plate,
        supplier_source : req.body.supplier_source,
        supplier : req.body.supplier,
        expediture_date : req.body.expdate,
        cargo_type: req.body.cargotype,
        sanity_codition : req.body.sanitybexpedit,
        cropdays: req.body.cropdays,
        watertemp : req.body.watertemp,
        tanknumber : req.body.tanknumber,
        food : req.body.food,
        weigth : req.body.weigth,
        boxqty : req.body.boxqty,
        fingerlingssource : req.body.fingerlingssource,
        sourcelot : req.body.sourcelot,
        treats : req.body.treats,
        fasting : req.body.fasting,
        croptype: req.body.croptype,
        expedituresatisfactory: req.body.expedituresatisfactory,
        despescaconditions : req.body.despescaconditions,
        despescaconditionsdrugs : req.body.despescaconditionsdrugs,
        graceperiod : req.body.graceperiod,
        utilization_period: {
            begin: req.body.udate1,
            end: req.body.udate2
        },
        mortalityrate : req.body.mortalityrate,
        dissolvedoxygen : req.body.dissolvedoxygen,
        animaltransitguide: req.body.animaltransitguide
      },
      modifiedBy: req.user.email,
      active : true
    })

    lot.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Data already exists.')    
               break;        
           default: 
               req.flash('alert-danger', "Error on save:"+ err)  
               break;
        } 
      } else {          
        // res.redirect('/lots/show/'+lot._id)
        req.flash('alert-info', 'Lot [' + lot.lotno + '] created with success!')  
        res.redirect('/receive/manual')
      }
      res.render('lots/manual.jade', { title: 'DriveOn Blockchain | New Lot', baseuri:baseurl});
    })
 }


lotController.confirmation = function(req, res) {   
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
  var jday = moment().format('Y') + moment().format('DDDD');
  var lotk = getLotNoConfiguration ()=='guid' ? short.uuid().toUpperCase():jday;
 Supplier
  .find({},function(err,supplier){
    if(!err){
    Vehicle
    .find({},function(err, vehicle){
      if(!err){
        Driver
          .find({},function(err, driver){
            if(!err){
              Product  
              .find({},function(err,product){
                if(!err){
                  Lot.count().exec(function(err, count){
                    var cnt = count+1;
                      res.render('lots/goodreceive',
                      { title: 'DriveOn Blockchain | Confirmation (Lakes)',             
                          user_info: req.user,
                          baseuri: baseurl,
                          products: product,
                          drivers: driver,
                          vehicles: vehicle,
                          suppliers: supplier,
                          lotstatus:'Processing',
                          nextlot: lotk 
                        });
                  });  
                }
              })
            }        
          }) 
      }
    })
    }
  })
                
}  

lotController.goodreceiveconfirmation = function(req, res)  {
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    const dwork = moment().format() 
      //  console.log('Body=>' + JSON.stringify(req.body))

    var GR = new LotStock({
      lotno : req.body.lotid,
      d_prod : dwork,
      q_in : req.body.q_in,      
      createdBy: req.user.email,
      active : true
    })

    GR.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Data already exists.')    
               break;        
           default: 
               req.flash('alert-danger', "Error on save GR:"+ err)  
               break;
        } 
      } else {          
        req.flash('alert-info', 'Lot confirmation saved with success!')  
        res.redirect('/processing/goods/confirmation')
      }
      res.render('lots/goodreceive.jade', { title: 'DriveOn Blockchain | Confirmation', baseuri:baseurl});
    })
}

 
module.exports = lotController  

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

 function getProductDescription(tproduct){
  //  console.log('getProductDescription:tproduct='+ tproduct)
    Product.findOne({_id:tproduct})
      .exec(function(err, product){
        if (!err){
          // console.log('getProductDescription:product='+ product.description) 
          var retProductdesc = product.description
          return retProductdesc
        }else{
          return 'No Description found'
        }
    })
 }

 function getLotNoConfiguration(){
  ExtensiveClass.findOne({class:'configuration',active:true})
    .exec(function(err, exclass){
       if (!err){
        ExtensiveValue.findOne({class:exclass._id, active:true})
          .exec(function(err,configs){
            if(!err){
              var retValue = configs.value
              return retValue
            }else{
              return 'No Value for Class [Configuration] set'
            }
          })
       }else{
         return 'No Class [Configuration] found'
       }
    })

  
 }