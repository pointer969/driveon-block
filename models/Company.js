var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var compType =['Producer','Process','Customer']

var DO_COM_M00Schema = new Schema({
    company : String, 
    name : String, 
    commercialName : String, 
    business_segment: {
        type: String,
        enum: compType
    },
    address1 : String, 
    address2 : String, 
    address3 : String, 
    district : String, 
    city : String, 
    state : String, 
    country : String, 
    zipcode : String, 
    email : String, 
    activeStatus : String, 
    createdAt : Date, 
    createdBy : String, 
    updatedAt : Date, 
    updatedBy : String 
})

module.exports =  mongoose.model('u1_com_m00', DO_COM_M00Schema)