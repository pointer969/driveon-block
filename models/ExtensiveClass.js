var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var bcrypt    = require('bcrypt')
var mongooseLogs = require('mongoose-activitylogs')

var ExtensiveClassSchema = new Schema({    
    class: {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    },
    description: String,
    rate: Number,
    active: {
         type: Boolean,
         required: true
    } 
},
{
    timestamps:true
}
)

ExtensiveClassSchema.plugin(mongooseLogs, {
    schemaName: "extensive class",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })

var extclass = mongoose.model('u1_sys_m00', ExtensiveClassSchema)

module.exports = extclass