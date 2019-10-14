var mongoose        = require("mongoose")
var intsvcs          = require("../models/IntegrationSvc")


exports.list = function(req, res){
    console.log('List Services')
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const _id = req.query.item;
    const limit = 10;

    const options = {
      limit: limit,
      page: page
    };

    intsvcs
        .find({}, function(err, srcvs){
            intsvcs.count().exec(function(err, count){
                    res.render('index',
                    { title: 'DriveOn | Serviços', 
                        services: srcvs,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
            });        
        })
        .limit(limit)
        .skip(limit * page);  
 };