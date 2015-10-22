var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var scheduleSchema = new Schema({
  address: String,
  geometry: { // GeoJSON
    type: { type: String },
    coordinates: [Number]
  },
  open: String,
  close: String
});

var foodtruckSchema = new Schema({
  name: String,
  cuisine: String,
  payment: String,
  description: String,
  schedule: {
    monday: [scheduleSchema],
    tuesday: [scheduleSchema],
    wednesday: [scheduleSchema],
    thursday: [scheduleSchema],
    friday: [scheduleSchema],
    saturday: [scheduleSchema],
    sunday: [scheduleSchema]
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

 var FoodTruck = mongoose.model('foodtruck', foodtruckSchema);

 module.exports = FoodTruck;
