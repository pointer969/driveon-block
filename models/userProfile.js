var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var bcrypt    = require('bcrypt')
var mongooseLogs = require('mongoose-activitylogs')

var ProfileSchema = new Schema({    
    userProfile: {
        type: String,
        unique: true,
        lowercase: true,
        required: true
    },
    ProfileDescription: String,
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

ProfileSchema.plugin(mongooseLogs, {
    schemaName: "profile",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })


module.exports = mongoose.model('u1_usr_m01', ProfileSchema)