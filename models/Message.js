var mongoose  = require("mongoose")
var Schema    = mongoose.Schema

var MessageSchema = new Schema({

  fullMessage: String,
  ip: String,
  dateReceived: String,

  packageHead: String,
  packageLength: String,
  dongleCode: String,
  eventcode: String,
  

  gpsData: String,
  obdModule: String,
  firmwareVersion: String,
  hardwareVersion: String,
  qtparam: String,
  param: String,
  dongleDateHex: String,
  crcCode: String,

  data: String,

  time: String, 

  dataSitch: String,

  pid1: {
    noId: String,
    len: String,
    dec: String
  },
  pid2: {
    noId: String,
    len: String,
    dec: String
  },
  pid3: {
    noId: String,
    len: String,
    dec: String
  },
  pid4: {
    noId: String,
    len: String,
    dec: String
  },
  pid5: {
    noId: String,
    len: String,
    dec: String
  },
  pid6: {
    noId: String,
    len: String,
    dec: String
  },
  pid7: {
    noId: String,
    len: String,
    dec: String
  },
  pid8: {
    noId: String,
    len: String,
    dec: String
  },
  pid9: {
    noId: String,
    len: String,
    dec: String
  },
  pid10: {
    noId: String,
    len: String,
    dec: String
  },
  
  currentTripFuelConsumption: String,
  currentTripMileage: String, 
  currentTripDuration: String ,
  
  GSENSOR_Data: String, 
  customField: String,

  //alarm

  randomNo: String,
  alarmTag: String,
  alarmNo: String,
  alarmThreshold: String,
  alarmCurrent: String,
  alarmTime: String,
  rtcTime: String,

  //Setting
  paramNumbers: String,
  parameterSettingData: String,
  
  //Inquiry
  inquiryParamList: String,
  //log type

  logType: String,

  //Read Specified PID Data Value

  pidNumbers: String,
  pidList: String,

  //Read Vehicle DTCs
  dtcType: String,

  //Send Upgrading/Reply
  updrade: String,
  upgradeID: String,
  totalPcktNumber: String,
  crcNumbers: String,
  crcArray: String,

  //Issue Upgrade Package /Reply

  packetSign: String,
  packetNumber: String,
  packetLength: String,
  packetContents: String,

  //read vin 
  vinCode: String
})

//Register schema to Mongoose
var Message = mongoose.model('Message', MessageSchema);

module.exports = Message