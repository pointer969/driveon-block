var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var LotSchema = new Schema({    
    lotno: {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    },
    lotkey: {
        type: String,
        lowercase: false
    },  
    serials : { type: Schema.Types.Array},
    d_work: Date,  
    description: String,
    tank: Number,
    product: String,
    supplier: String,
    status: String,
    events:{
        process: String,
        dlog: Date,
        species: String,
        drivername: { type: Schema.Types.ObjectId, ref: 'u1_drv_m00' }, 
        plate: { type: Schema.Types.ObjectId, ref: 'u1_car_m01' }, 
        supplier_source: String,
        supplier: { type: Schema.Types.ObjectId, ref: 'u1_sup_m00' }, 
        expediture_date: Date,
        cargo_type: String,
        sanity_codition: String,
        cropdays: Number,
        watertemp : Number,
        tanknumber : Number,
        food : String,
        weigth : Number,
        boxqty : Number,
        fingerlingssource : String,
        sourcelot : String,
        treats : String,
        fasting : String,
        croptype: String,
        expedituresatisfactory:String,
        despescaconditions : String,
        despescaconditionsdrugs : String,
        graceperiod : Number,
        utilization_period: {
            begin: Date,
            end: Date
        },
        mortalityrate : Number,
        dissolvedoxygen : Boolean,
        animaltransitguide: String,
        flavorcheck:{
            d_insp_d : Date,
            weigth: Number,
            offflavor: { type: Schema.Types.Array}
        },
        iqc:{
            d_insp_d : Date,
            eyes : String,
            qcyescomments : String,
            gills : String,
            qcgillscomments : String,
            belly: String,
            qcbellycomments : String,
            scales: String,
            qcscalescomments : String,
            qcactions: {
                nonreport: String,
                qcaction: String,
                qcverification: String,
                qcprevent: String
            }
        }        
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

LotSchema.plugin(mongooseLogs, {
    schemaName: "Lot",
    createAction: "created",
    updateAction: "updated",
    deleteAction: "deleted" 
 })

var variables = mongoose.model('u1_lot_m00', LotSchema)

module.exports = variables