var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var assert = require('assert');
var food_trucks = require('food_trucks_data_2015-10-16T21:09:32.428Z');
// var breweries = require('BREWERY_DATA.JSON');
// var distilleries = require ('DISTILLERY_DATA.JSON');

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









// var mongoose = require('mongoose');
// mongoose.connect('mongodb://localhost/boozeybites');
//
// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
//   // yay!
// });
//
// var kittySchema = mongoose.Schema({
//     name: String
// });
//
// // note: methods must be added to the schema before compiling it with mongoose.model()
// kittySchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name";
//   console.log(greeting);
// }
//
// var Kitten = mongoose.model('Kitten', kittySchema);
//
// var silence = new Kitten({ name: 'Silence' });
// console.log(silence.name); // 'Silence'
//
// var fluffy = new Kitten({ name: 'fluffy' });
// fluffy.speak(); // "Meow name is fluffy"
//
//
// fluffy.save(function (err, fluffy) {
//   if (err) return console.error(err);
//   fluffy.speak();
// });







// http://stackoverflow.com/questions/30696946/how-to-import-json-into-mongodb-using-mongoose

// var mongoose = require('mongoose');
// var assert = require('assert');
// var Schema = mongoose.Schema;
// var json_seeds = require('./food_trucks_data_2015-10-16T16:37:25.199Z')
// var FoodTruck = require('./models/food_trucks_schema');
//
// mongoose.connect('mongodb://localhost/boozeybites');
//
// var insertDocuments = function(db, callback) {
//    db.collection('food_trucks').insertMany(json_seeds, function(err, result) {
//     assert.equal(err, null);
//     console.log("Inserted documents into collection.");
//     callback(result);
//   });
// };
//
// MongoClient.connect(url, function(err, db) {
//
//
//   assert.equal(null, err);
//   insertDocuments(db, function() {
//       db.close();
//   });
// });



// EXAMPLE 1
// > var mongoose = require('mongoose')
// > var assert = require('assert')
//
// > mongoose.connect('mongodb://localhost/test');
//
// > var Schema = mongoose.Schema
// > var clubSchema = new Schema({
// ...   name: String,
// ... })
//
// > var Club = mongoose.model('Club', clubSchema)
//
// // Now, the interesting part:
// > data = [
// ...   { 'name' : 'Barcelona' },
// ...   { 'name' : 'Real Madrid' },
// ...   { 'name' : 'Valencia' }
// ... ]
// > Club.collection.insertMany(data, function(err,r) {
// ...       assert.equal(null, err);
// ...       assert.equal(3, r.insertedCount);
// ...
// ...       db.close();
// ... })



// EXAMPLE 2
// var MongoClient   = require('mongodb').MongoClient;
// var assert        = require('assert');
// var ObjectId      = require('mongodb').ObjectID;
// var url           = 'mongodb://localhost:27017/test';
//
// var insertDocument = function(db, callback) {
//    db.collection('restaurants').insertOne( {
//       "address" : {
//          "street" : "2 Avenue",
//          "zipcode" : "10075",
//          "building" : "1480",
//          "coord" : [ -73.9557413, 40.7720266 ]
//       },
//       "borough" : "Manhattan",
//       "cuisine" : "Italian",
//       "grades" : [
//          {
//             "date" : new Date("2014-10-01T00:00:00Z"),
//             "grade" : "A",
//             "score" : 11
//          },
//          {
//             "date" : new Date("2014-01-16T00:00:00Z"),
//             "grade" : "B",
//             "score" : 17
//          }
//       ],
//       "name" : "Vella",
//       "restaurant_id" : "41704620"
//    }, function(err, result) {
//     assert.equal(err, null);
//     console.log("Inserted a document into the restaurants collection.");
//     callback(result);
//   });
// };
//
// MongoClient.connect(url, function(err, db) {
//   assert.equal(null, err);
//   insertDocument(db, function() {
//       db.close();
//   });
// });
