var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

// Water QC
var WaterQCchema = new Schema({
    placeid: {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    }, 
    date: String,
    time: String,
    ph: Number,   
    cloroppm:   Number,
    status:  {
        type: String,
        index: true
    },
    colector: String,
    active:Boolean
},
{
    timestamps:true
}
)

WaterQCchema.plugin(mongooseLogs, {
    schemaName: "waterqc",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
  })
  

module.exports =  mongoose.model('u1_qc_t00', WaterQCchema)