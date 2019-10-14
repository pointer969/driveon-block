var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DocumentSchema = new Schema({
    document_title   : String,  
    comments        : String, 
    path: String ,
    document_type: String,
    active  : Boolean,
    createdBy : String,
    updatedBy: String
},
{
    timestamps:true
})

DocumentSchema.plugin(mongooseLogs, {
  schemaName: "document",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_doc_m00', DocumentSchema)