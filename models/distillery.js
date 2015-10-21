var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var opencloseSchema = new Schema({
  open: String,
  close: String
});

var distillerySchema = new Schema({
  name: String,
  address: String,
  geometry: { // GeoJSON
    type: { type: String, default: "Point" },
    coordinates: [Number]
  },
  schedule: {
    monday: [opencloseSchema],
    tuesday: [opencloseSchema],
    wednesday: [opencloseSchema],
    thursday: [opencloseSchema],
    friday: [opencloseSchema],
    saturday: [opencloseSchema],
    sunday: [opencloseSchema]
  },
   website: String
 });

var Distillery = mongoose.model('distillery', distillerySchema);

module.exports = Distillery;
