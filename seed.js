var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var db = mongoose.connection;
var assert = require('assert');
var food_trucks = require('./FOOD_TRUCK_GEO');
var breweries = require('./BREWERY_GEO');
var distilleries = require ('./DISTILLERY_GEO');

mongoose.connect('mongodb://localhost/boozeybites');
console.log('Connected to database.');

db.collection("foodtrucks").drop(function(err) {
  if (err) {
    console.log("Collection drop error: ", err);
  } else {
    console.log("foodtrucks collection dropped.");
  }
});

db.collection("breweries").drop(function(err) {
  if (err) {
    console.log("Collection drop error: ", err);
  } else {
    console.log("breweries collection dropped.");
  }
});

db.collection("distilleries").drop(function(err) {
  if (err) {
    console.log("Collection drop error: ", err);
  } else {
    console.log("distilleries collection dropped.");
  }
});

var FoodTruck = require('./models/foodtruck');
var Brewery = require('./models/brewery');
var Distillery = require('./models/distillery');


// Insert data into collection
FoodTruck.collection.insertMany(food_trucks, function(err,res) {
       assert.equal(null, err);
       assert.equal(116, res.insertedCount);
       console.log(res.insertedCount);

      //  db.close();
 });

 Brewery.collection.insertMany(breweries, function(err,res) {
        assert.equal(null, err);
        assert.equal(34, res.insertedCount);
        console.log(res.insertedCount);

        // db.close();
  });

 Distillery.collection.insertMany(distilleries, function(err,res) {
        assert.equal(null, err);
        assert.equal(12, res.insertedCount);
        console.log(res.insertedCount);

        // db.close();
  });
