var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var LotStockSchema = new Schema({    
    lotno: { type: Schema.Types.ObjectId, ref: 'u1_lot_m00' }, 
    d_prod: Date,  
    q_in: Number,
    q_out: Number,
    blockchain: String,
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

LotStockSchema.plugin(mongooseLogs, {
    schemaName: "LotStock",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })

var variables = mongoose.model('u1_lot_t01', LotStockSchema)

module.exports = variables