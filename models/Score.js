var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_SCORESchema = new Schema({
    slot: String,
    indice: String,
    refdate: String,
    value: Number
},
{
    timestamps:true
})

DO_SCORESchema.plugin(mongooseLogs, {
  schemaName: "score",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_score', DO_SCORESchema)