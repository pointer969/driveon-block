var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_CAR_D00Schema = new Schema({
    ID: Number,
    VehicleID: Number,
    Timestamp: String,
    Mileage : Number,
    MileageSpecified: Boolean,
    OperatingTime: Number,
    OperatingTimeSpecified: Boolean,
    NextMaintenanceActivity: {
        Date: String,
        MaintenanceActivity: String,
        DistanceToNextMaintenanceActivity : Number,
        DistanceToNextMaintenanceActivitySpecified : Boolean
    },
    MaintenanceData: [
        {
            ID: Number,
            IDSpecified : Boolean,
            ServiceUnit : String,
            DateOfNextMaintenance: String,
            RenewalDistance : Number,
            RenewalDistanceSpecified :  Boolean
        }
    ],
    LiquidsData: {
        OilQuality : String,
        FuelQuality : String,
        OilViscosity : String,
        TransmissionOilQuality : String
    }
},
{
    timestamps:true
})

DO_CAR_D00Schema.plugin(mongooseLogs, {
  schemaName: "vehicleMBPrognosis",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_car_d00', DO_CAR_D00Schema)