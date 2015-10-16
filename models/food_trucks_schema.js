var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// https://github.com/Automattic/mongoose/wiki/3.6-Release-Notes#geojson-support-mongodb--24
// http://blog.mongodb.org/post/52299826008/the-mean-stack-mistakes-youre-probably-making

var scheduleSchema = new Schema({
  address: String,
  geometry: { // GeoJSON
    type: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  open: String,
  close: String
});

var truckSchema = new Schema({
  establishment: String,
  name: String,
  cuisine: String,
  payment: String,
  description: String,
  schedule: {
    monday: scheduleSchema,
    tuesday: scheduleSchema,
    wednesday: scheduleSchema,
    thursday: scheduleSchema,
    friday: scheduleSchema,
    saturday: scheduleSchema,
    sunday: scheduleSchema
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

module.exports = mongoose.model('FoodTruck', truckSchema);
