var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DriverSchema = new Schema({
    driverlicense       : {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    },
    name        : String,  
    active      : Boolean,
    createdBy : String,
    updatedBy: String
},
{
    timestamps:true
})

DriverSchema.plugin(mongooseLogs, {
  schemaName: "driver",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_drv_m00', DriverSchema)