var mongoose  = require('mongoose')
var Schema    = mongoose.Schema

var DO_SVC_T00Schema = new Schema({
    Area : String,
    services : String, 
    description : String, 
    status : String,
    records : String, 
    last_run : String,
    createdAt : Date, 
    createdBy : String, 
    updatedAt : Date, 
    updatedBy : String 
})

module.exports =  mongoose.model('u1_svc_t00', DO_SVC_T00Schema)