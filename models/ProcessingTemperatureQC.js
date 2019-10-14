var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

// Temperature QC
var TemperatureQCchema = new Schema({
    placeid: {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    }, 
    date: String,
    time: String,
    temperature: Number,   
    unit:   String,    
    colector: String,
    active:Boolean
},
{
    timestamps:true
}
)

TemperatureQCchema.plugin(mongooseLogs, {
    schemaName: "temperatureqc",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
  })
  

module.exports =  mongoose.model('u1_qc_t01', TemperatureQCchema)