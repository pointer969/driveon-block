var mongoose = require('mongoose');
var passport = require('passport');
var Customer = require('../models/Customer');
var Supplier = require('../models/Supplier');
var Lot = require('../models/Lot');
var LotStock = require('../models/LotStock');
var LotTracking = require('../models/LotTracking');
var SalesOrder = require('../models/SalesOrder')

/*
ExcelJS
*/
var Excel = require('exceljs');
/******************************************************** */

var getLotFilter = function(query) {
    var result = {
        // dtsalesorder: new RegExp(query.dtsalesorder, "i"),
        description: new RegExp(query.description, "i"),
        product: new RegExp(query.product, "i"),
        // cntr: new RegExp(query.cntr, "i"),
        d_work: new RegExp(query.d_work, "i"),
        // dtdeparture: new RegExp(query.dtdeparture, "i"),
        // dtarrival: new RegExp(query.dtarrival, "i"),
        // dtdemurrage: new RegExp(query.dtdemurrage, "i")//,
        // supplier: new RegExp(query.supplier, "i"),
        // customer: new RegExp(query.customer, "i"),
        // status: new RegExp(query.status, "i")
    };

    // if(query.Married) {
    //     result.Married = query.Married === 'true' ? true : false;
    // }

    // if(query.Country && query.Country !== '0') {
    //     result.Country = parseInt(query.Country, 10);
    // }
    // console.log(result);
    return result;
 };

 var reportController = {}

 /***********************/
/* Pivot Table */
/***********************/
reportController.pivot = function(req, res) {        
    res.render('reports/pivot',  { user: req.user, title:  'Un1ty | Pivot'});
  };

reportController.lots = function(req, res) {        
    Lot
    // .find({active:true})    
    .find({})    
    // .populate({
    //     path:'supplier', 
    //     select:'name',            
    //     match:{ activeStatus: true },
    //     options: { sort: { $natural: -1 }}
    // })            
    // .populate({
    //     path:'customer', 
    //     select:'fullname',
    //     match:{ active: true },
    //     options: { sort: { $natural: -1 }}
    // })  
    .exec(function(err, lots) {
        if(err){
            console.log('Erro on load grid:' + err);
        } else {
            var retmsg =[];

            for(var i=0;i < lots.length;i++){
                var ldwork = lots[i].d_work
                // if (ldwork) {
                //   ldwork = ldwork.split('/')[1] + '/' +  ldwork.split('/')[2];
                // }                   
                var lotid = lots[i].id
                var lotno = lots[i].lotno
                var ldesc = lots[i].description
                var lstatus = lots[i].status
                var ltank = lots[i].tank
                var lproduct = lots[i].product
                var lprocess = lots[i].process

                var retorno = {
                        "id" : lotid,
                        "lotno" : lotno,
                        "description" : ldesc,
                        "status" : lstatus,
                        "tank" : ltank,
                        "d_work_d" : ldwork,
                        "product" : lproduct,
                        "process" : lprocess
                };   
                retmsg.push(retorno);
            };
            // console.log(retmsg); :                    
            res.json(retmsg);
        }
    });
    
  };  


module.exports = reportController;  

