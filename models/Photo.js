var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var photoSchema = new Schema({
  path:  { type: String },
  caption: { type: String }
  });
module.exports = mongoose.model('u1_doc_m01', photoSchema);