var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var assert = require('assert');
var food_trucks = require('./food_trucks_data_2015-10-16T21:09:32.428Z');
// var breweries = require('./BREWERY_DATA.JSON');
// var distilleries = require ('./DISTILLERY_DATA.JSON');


// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   // yay!
// });

mongoose.connect('mongodb://localhost/boozeybites');
console.log('Connected to database.');
mongoose.connection.db.dropDatabase(function (err) {
  if (err) {
    console.log("*** Error dropping datatabse: ", err);
  } else {
    console.log('Database dropped.');
  }
}); // end db drop

var scheduleSchema = new Schema({
  address: String,
  geometry: { // GeoJSON
    type: { type: String, default: "Point" },
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  open: String,
  close: String
});

var foodtruckSchema = new Schema({
  establishment: String,
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

 var brewerySchema = new Schema({
   name: String,
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
     website: String
   }
  });

  var distillerySchema = new Schema({
    name: String,
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
      website: String
    }
   });

var FoodTruck = mongoose.model('foodtruck', foodtruckSchema);
var Brewery = mongoose.model('brewery', brewerySchema);
var Distillery = mongoose.model('distillery', distillerySchema);

// Insert data into collection
FoodTruck.collection.insertMany(food_trucks, function(err,res) {
       assert.equal(null, err);
       assert.equal(119, res.insertedCount);
       console.log(res.insertedCount);

       db.close();
 });

 // Brewery.collection.insertMany(breweries, function(err,res) {
 //        assert.equal(null, err);
 //
 //        db.close();
 //  });

 // Distillery.collection.insertMany(distilleries, function(err,res) {
 //        assert.equal(null, err);
 //
 //        db.close();
 //  });
