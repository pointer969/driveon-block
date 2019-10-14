var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var SOSchema = new Schema({    
    so: {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    },
    d_sales: Date,  
    description: String,
    drivername: { type: Schema.Types.ObjectId, ref: 'u1_drv_m00' }, 
    customer: { type: Schema.Types.ObjectId, ref: 'u1_cus_m00' },
    loading_cargo: {
        begin: String,
        end: String
    }, 
    destination: String,
    monitoringBy: String,
    vehicle:{
        vehicle : { type: Schema.Types.ObjectId, ref: 'u1_car_m01' },
        thermoking: String,
        truckconditions: String,
        threshing: String,
        floor: String,
        sides: String,
        pallets: String,
        rubber: String,
        temperature: Number 
    },
    products: { type: Schema.Types.Array},
    fiscal: {
        nf: Number,
        serie: Number,
        d_nf: String
    },
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

SOSchema.plugin(mongooseLogs, {
    schemaName: "SalesOrder",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })

var variables = mongoose.model('u1_sor_m00', SOSchema)

module.exports = variables