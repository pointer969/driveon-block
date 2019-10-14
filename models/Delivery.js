var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DeliverySchema = new Schema({
    sono: { type: Schema.Types.ObjectId, ref: 'u1_sor_m00' },  
    confirmid        : String, 
    comments        : String, 
    d_confirmation: Date ,
    active  : Boolean,
    createdBy : String,
    updatedBy: String
},
{
    timestamps:true
})

DeliverySchema.plugin(mongooseLogs, {
  schemaName: "Delivery",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_sor_t00', DeliverySchema)