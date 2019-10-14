var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var VehicleSchema = new Schema({
    plate       : {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    },
    device      : { type: Schema.Types.ObjectId, ref: 'u1_dev_m00' }, 
    vin         : String,    
    model       : String,
    color       : String,
    state       : String,
    customer    : { type: Schema.Types.ObjectId, ref: 'u1_cus_m00' },
    motor       : String,
    fueltype    : String,
    manufYear   : String,
    active      : Boolean
},
{
    timestamps:true
})

VehicleSchema.plugin(mongooseLogs, {
  schemaName: "vehicle",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_car_m01', VehicleSchema)