var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_CAR_P00Schema = new Schema({
    FLEETID: String,
    History: String,
    Header: {
        Messagetype : String,
        Sentstatus : String,
        Inbound : String,
        ClientTimestamp : String,
        ServerTimestamp : String,
        VehicleTimestamp : String,
        CreationBeginTimestamp : String,
        CreationEndTimestamp : String,
        Position: {
            Long : Number,
            LongSpecified : Boolean,
            Lat : Number,
            LatSpecified : Boolean,
            PosText : String,
            Course : String,
            Speed : String,
            KM : String,
            GPSStatus : String,
            TracePositions : String,
            timestamp: String 
        },
        ReadInfo: String,
        Confirmation : String,
        Scheduled: String,
        VehicleID: Number,
        VehicleIDSpecified:  Boolean,
        DriverID : String,
        DeliveryPriority: String,
        States: [
            {
                name: String,
                timestamp : String,
                Value: String
            }
        ]

    },
    body : {
        FreetextMsg: String,
        OrderMsg: String,
        StatusDefMsg: String,
        FormDefMsg: String,
        AutoPosDef: String,
        VehiclestatusMsg: String,
        DriverStatusMsg: String,
        OrderstatusMsg: String,
        TourstatusMsg: String,
        ReplystatusMsg: String,
        SimcardChgMsg: String,
        HexMsg: String,
        CacheMsg: String,
        TextConfMsg: String,
        VehiclereplyMsg: String,
        InboxDataMsg: String,
        EventStatusMsg: String,
        PairingMsg: String,
        TrailerEventMsg: String,
        TrailerRegisterMsg: String,
        TrailerSyncMsg: String,
        TourEventUptimeMsg: String,
        TrailerCouplingMsg : String
    },
    ForeignRef : String,
    inoid : String,
    fbid : String    
},
{
    timestamps:true
})

DO_CAR_P00Schema.plugin(mongooseLogs, {
  schemaName: "vehicleMBPosition",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_car_p00', DO_CAR_P00Schema)