var mongoose        = require("mongoose")
var zones          = require("../models/do_stat_m00")


exports.list = function(req, res){
    console.log('List zones')
    const page = (req.query.page > 0 ? req.query.page : 1) - 1;
    const _id = req.query.item;
    const limit = 10;

    const options = {
      limit: limit,
      page: page
    };

    zones
        .find({}, function(err, zon){
            zones.count().exec(function(err, count){
                    res.render('zones',
                    { title: 'DriveOn | Zonas de Pontuação', 
                        zonas: zon,
                        page: page + 1,
                        pages: Math.ceil(count / limit)}
                    );
            });        
        })
        .limit(limit)
        .skip(limit * page);  
 };