var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

// Products
var ProductSchema = new Schema({
    product: {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    }, 
    description: String,
    standard_uom: String,
    sales_uom: String, 
    standard_packing: String,
    comments: String,  
    species: {
        type: String,
        index: true
    },
    active:Boolean,
    modifiedBy: String
},
{
    timestamps:true
}
)

ProductSchema.plugin(mongooseLogs, {
    schemaName: "product",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
  })
  

module.exports =  mongoose.model('u1_pro_m00', ProductSchema)