var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var opencloseSchema = new Schema({
  open: String,
  close: String
});

var brewerySchema = new Schema({
  name: String,
  address: String,
  geometry: { // GeoJSON
    type: { type: String },
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
  contact: {
    facebook: String,
    twitter_link: String,
    twitter_id: String,
    twitter_screen_name: String,
    twitter_name: String,
    website: String
  }
 });

 var Brewery = mongoose.model('brewery', brewerySchema);

 module.exports = Brewery;
