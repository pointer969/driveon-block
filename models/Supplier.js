var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var compType =['Farm','Process','Timber']

var mongooseLogs = require('mongoose-activitylogs')

var SupplierSchema = new Schema({
    supplier : String, 
    name : String, 
    commercialName : String, 
    business_segment: {
        type: String,
        enum: compType
    },
    statebusinesscode: String,
    address1 : String, 
    address2 : String,  
    district : String, 
    city : String, 
    province : String, 
    country : String, 
    zipcode : String, 
    email : String, 
    activeStatus : String, 
    createdAt : Date, 
    createdBy : String, 
    updatedAt : Date, 
    updatedBy : String 
},
{
    timestamps:true
}
)

SupplierSchema.plugin(mongooseLogs, {
    schemaName: "Supplier",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })

module.exports =  mongoose.model('u1_sup_m00', SupplierSchema)