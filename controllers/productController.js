var mongoose        = require('mongoose')
var passport        = require('passport')
var Product       = require('../models/Product')
var extClass      = require('../models/ExtensiveClass')
var extValue      = require('../models/ExtensiveValue')
var bcrypt          = require('bcrypt')
var jwt             = require('jsonwebtoken')
var config          = require('../lib/config')
var async           = require('run-async')

var productController = {}

/**
 * CRUD
 */ 
productController.list = function(req, res) {   
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    var page = (req.query.page > 0 ? req.query.page : 1) - 1;
    var _id = req.query.item;
    var limit = 10;
    var options = {
      limit: limit,
      page: page
    };

    extClass.find({"class": "species"}).exec(function(err, eclasses){
      extValue.find({"class":eclasses._id,"active": true}).exec(function(err, species){
        Product
        .find({}, function(err, products){
          Product.count().exec(function(err, count){
              if (count > 0) {
                    res.render('products/index',
                    { title: 'DriveOn Blockchain | Products', 
                        list: products,
                        user_info: req.user,
                        baseuri: baseurl,
                        specieslist:species,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
                  }else{
                    res.render('products/new.jade', { title: 'DriveOn Blockchain | New Product',baseuri:baseurl, specieslist:species});
                  }     
            });        
        })        
        .limit(limit)
        .skip(limit * page)
      })
    })     
    
  }

productController.create = function(req, res){         
    var baseurl = req.protocol + "://" + req.get('host') + "/"     
    var arrayRet = [] 
    // extClass.find({"class": "species",active: true}).exec(function(err, eclasses){
    //   extValue.find({active: true}).exec(function(err, species){        
    //     for(var i = 0; i < species.length; i++) {
    //       var spec = species[i].value
    //       var specdesc = species[i].description
    //       var message0 =  {"species": spec, "description": specdesc }
    //       arrayRet.push(message0)
    //     }
    //     res.render('products/new.jade', { title: 'DriveOn Blockchain | New Product', baseuri:baseurl, specieslist:arrayRet})
    //   })
    // })    
     var message0 =  {"species": "Tilapia", "description": "Tilapia" }
     arrayRet.push(message0)
     var message0 =  {"species": "Tambaqui", "description": "Tambaqui" }
     arrayRet.push(message0)
     var message0 =  {"species": "Pirarucu", "description": "Pirarucu" }
     arrayRet.push(message0) 
     var message0 =  {"species": "Pintado", "description": "Pintado" }
     arrayRet.push(message0) 
    res.render('products/new.jade', { title: 'DriveOn Blockchain | New Product', baseuri:baseurl, specieslist:arrayRet})
 }   
 
productController.show = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/" 
 if (req.params.id != null || req.params.id != undefined) {   
  extClass.find({"class": "species"}).exec(function(err, eclasses){
    extValue.find({"class":eclasses._id,"active": true}).exec(function(err, species){  
      Product.findOne({_id: req.params.id}).exec(function (err, prods) {
        if (err) {         
          req.flash('alert-danger', "Error:"+ err)                
        } else {     
          req.flash('alert-info', 'Data saved with sucess!')       
          res.render('products/show', {products: prods, baseuri:baseurl, specieslist:species});
        }
      })
    })
  })      
  } else {    
    res.render('errors/500', {message:'Internal error, please contact system administrator!'});    
  }
 }    

productController.edit = function(req, res){ 
  var baseurl = req.protocol + "://" + req.get('host') + "/"  
  extClass.find({"class": "species"}).exec(function(err, eclasses){
    extValue.find({"class":eclasses._id,"active": true}).exec(function(err, species){
      Product.findOne({_id: req.params.id}).exec(function (err, uprofile) {
        if (err) {
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Product already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on Edit:"+ err)  
                 break;
          }   
        } else {          
          res.render('products/edit', {products: uprofile, baseuri:baseurl, specieslist:species});
        }
      })
    })
  })     
 }

productController.update = function(req, res){  
    var baseurl = req.protocol + "://" + req.get('host') + "/"    
    Product.findByIdAndUpdate(
          req.params.id,          
          { $set: 
              { 
                product 	:req.body.product,
                description   :req.body.description,
                standard_uom :req.body.standard_uom,
                sales_uom     :req.body.sales_uom,
                standard_packing    :req.body.standard_packing,
                comments     :req.body.comments, 
                species:req.body.species,
                active :req.body.active,
                modifiedBy: req.user.email
              }
          }, 
          { new: true }, 
   function (err, product) {                                                              
        if (err) {         
          switch (err.code)
          {
             case 11000: 
                 req.flash('alert-danger', 'Product already exists.')    
                 break;        
             default: 
                 req.flash('alert-danger', "Error on update:"+ err)  
                 break;
          }
          res.render("products/edit", {products: req.body, baseuri:baseurl})
        }else{
          // req.flash('alert-info', 'Dados salvos com sucesso!')            
          res.redirect("/products/show/"+product._id)
        }
      })
 }  

productController.save  =   function(req, res){
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    var payload = req.body
    
    // if(req.user) {           
    //   // console.log('Check req.user data:'+ JSON.stringify(req.user))
    //   payload.modifiedBy = req.user.email
    //   // payload.active = false
    // }  
    
    var product = new Product(payload)      
    
    product.save(function(err) {
      if(err) {  
        switch (err.code)
        {
           case 11000: 
               req.flash('alert-danger', 'Product already exists.')    
               break;        
           default: 
               req.flash('alert-danger', 'Error on save:'+ err)  
               break;
        } 
      } else {          
        // req.flash('alert-info', 'Dados salvos com sucesso!')  
        res.redirect('/products/show/'+product._id)
      }
      res.render('products/new.jade', { title: 'DriveOn Blockchain | New Product', baseuri:baseurl});
    })
 }

productController.delete = function(req, res){    
    var baseurl = req.protocol + "://" + req.get('host') + "/" 
    Product.remove({_id: req.params.id}, function(err) {
        if(err) {
          switch (err.code)
          {
            case 11000: 
                req.flash('alert-danger', 'Product already exists.')    
                break;        
            default: 
                req.flash('alert-danger', "Error on delete:"+ err)  
                break;
          }  
        } else {    
          req.flash('alert-info', 'Data deleted with sucess!')        
          res.redirect("/products")
        }
      })
  }

module.exports = productController  