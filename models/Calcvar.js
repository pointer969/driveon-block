var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var bcrypt    = require('bcrypt')
var mongooseLogs = require('mongoose-activitylogs')
var calculationtype = ['Quantitativo','Qualitativo']
var variabletype = ['Numérico','Textual','Percentual']
var indexseq = ['1','2','3','4','5','6','7','8','9']

var CalcvarSchema = new Schema({    
    item: {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    },
    description: String,
    active: {
         type: Boolean,
         required: true
    },    
    calctype: {
        type: String,
        enum:calculationtype
    },
    valtype: {
        type: String,
        enum:variabletype
    },
    defaultvalue:String,
    minvalue: String,
    maxvalue: String,
    indexNo: {
        type: String,
        enum:indexseq
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

CalcvarSchema.plugin(mongooseLogs, {
    schemaName: "variables",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })

var variables = mongoose.model('u1_sys_t00', CalcvarSchema)

module.exports = variables