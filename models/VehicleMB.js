var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_CAR_M00Schema = new Schema({
    CHASSIS: String,
    VEHICLEHARDWARE: [{
        HARDWARE : String,
        HARDWAREID:  String
    }],
    FLEETVEHICLE: {
        FLEETID: Number,
        REGISTRATION: String,
        VEHICLENUMBER: String,
        INSMSISDN: String,
        STARTTIME: String,
        ENDTIME: String,
        VEHICLETYPE: String,
        STATUS: String
    },
    GROUPVEHICLE: [],
    REGISTRATIONDATE: String,
    TELEMATICGROUP: Number,
    TELEMATICGROUPSpecified: Boolean,
    VEHICLEPROPERTIES: String,
    inoid: String
},
{
    timestamps:true
})

DO_CAR_M00Schema.plugin(mongooseLogs, {
  schemaName: "vehicleMB",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_car_m00', DO_CAR_M00Schema)