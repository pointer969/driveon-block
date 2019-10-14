var mongoose  = require('mongoose'),
    Schema    = mongoose.Schema

var mongooseLogs = require('mongoose-activitylogs')

var CustomerSchema = new Schema({
    fullname: String,
    email: {
        type: String,
        lowercase: true,
        required: true
    },    
    businesscode:  {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    address1: String,
    address2: String,
    zipcode: String,
    district: String,
    city: String,
    province: String,
    country: String,
    active: Boolean,        
    createdBy: String,
    modifiedBy:String
    },
    {
        timestamps:true
    }
)

CustomerSchema.plugin(mongooseLogs, {
    schemaName: "customer",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
});


var customer = mongoose.model('u1_cus_m00', CustomerSchema)

module.exports = customer