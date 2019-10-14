var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var LotTrackingSchema = new Schema({    
    sono: { type: Schema.Types.ObjectId, ref: 'u1_sor_m00' }, 
    lotkey: {
        type: String,
        lowercase: false
    },  
    d_track: Date,  
    lat: Number,
    lon: Number, 
    blockchain: String,
    delivered: Boolean,  
    active: {
         type: Boolean,
         required: true
    },
    createdBy:{
        type: String
    },
    modifiedBy:{
        type: String
    }   
},
{
    timestamps:true
}
)

LotTrackingSchema.plugin(mongooseLogs, {
    schemaName: "LotTracking",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })

var variables = mongoose.model('u1_lot_t00', LotTrackingSchema)

module.exports = variables