var mongoose  = require('mongoose')
var Schema    = mongoose.Schema
var mongooseLogs = require('mongoose-activitylogs')

var DeviceSchema = new Schema({
    device   : {
        type: String,
        unique: true,
        lowercase: false,
        required: true
    },
    supplier   : String,
    description: String,
    active      : Boolean,
    firmware    : String,
    version     : String, 
    simnumber   : String,
        sms_srv_addr: String,
        sms_srv_key : String,
        sms_apn     : String,
        sms_user    : String,
        sms_password: String,
        sms_set_ip  : String,
        sms_set_port: String,            
    createdBy   : String,    
    updatedBy   : String
},
{
    timestamps:true
})

/**
 * Validations
 */
// DeviceSchema.path('device').validate(function (deviceId) {
//     if (this.skipValidation()) return true;
//     return device.length;
//     }, 'Deve ser informado um ID do dispositivo.');
// DeviceSchema.path('description').validate(function (name) {
//     if (this.skipValidation()) return true;
//     return name.length;
//   }, 'Nome não pode estar em branco!');

// DeviceSchema.path('firmware').validate(function (firmware) {
//     if (this.skipValidation()) return true;
//     return firmware.length;
//     }, 'Favor informar o firmware do dispositivo.');


// DeviceSchema.path('version').validate(function (version) {
//     if (this.skipValidation()) return true;
//     return version.length;
//     }, 'Favor informar a versão do dispositivo.');    

// DeviceSchema.path('sms_srv_addr').validate(function (sms_srv_addr) {
//     if (this.skipValidation()) return true;
//     return sms_srv_addr.length;
//     }, 'Favor informar a versão do dispositivo.');     

    DeviceSchema.plugin(mongooseLogs, {
        schemaName: "device",
        createAction: "created",
        updateAction: "updated",
        deleteAction: "deleted" 
     })

module.exports =  mongoose.model('u1_dev_m00', DeviceSchema)