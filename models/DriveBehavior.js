var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DO_CAR_A00Schema = new Schema({
    plate       : { type: Schema.Types.ObjectId, ref: 'do_car_m00' },
    device      : { type: Schema.Types.ObjectId, ref: 'do_dev_m00' }, 
    dworkd      : Date,
    index1      : Number,    
    index2      : Number,
    index3      : Number,
    index4      : Number,
    index5      : Number,
    index6      : Number,
    index7      : Number,
    index8      : Number,
    index9      : Number,
    indexAvg    : Number,    
    active      : Boolean
},
{
    timestamps:true
})

DO_CAR_A00Schema.plugin(mongooseLogs, {
  schemaName: "DriveBehavior",
  createAction: "created",
  updateAction: "updated",
  deleteAction: "deleted" 
})


module.exports =  mongoose.model('u1_car_a00', DO_CAR_A00Schema)