// http://stackoverflow.com/questions/30696946/how-to-import-json-into-mongodb-using-mongoose

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var FoodTruck = require('./models/food_trucks_schema');


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
