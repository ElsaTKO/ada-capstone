'use strict';

// import the moongoose helper utilities
var utils = require('../utils');
var should = require('should');
var FoodTruck = require('../../models/foodtruck');

describe('FoodTruck', function () {
  var foodtruck = {
    name: "The Worst Wurst",
    cuisine: "German",
    payment: "Cash or Cards",
    description: "Literally the wurst.",
    schedule: {
      monday: {
        address: "123 Lol St, Seattle, WA 98104, USA",
        open: "9:00",
        close: "17:00",
        geometry: {
          coordinates: [
            -122.12345,
            47.12345
          ],
          type: "Point"
        }
      },
      tuesday: {},
      wednesday: {},
      thursday: {},
      friday: {},
      saturday: {},
      sunday: {}
    },
    contact: {
      facebook: "https://www.facebook.com/worstwurst",
      twitter_link: "https://twitter.com/worstwurst",
      twitter_screen_name: "worstwurst",
      website: "http://www.worstwurst.com"
    }
  };

  describe('#create()', function () {
    it('should create a new foodtruck', function (done) {
      FoodTruck.create(foodtruck, function (err, createdFoodTruck) {
        should.not.exist(err);

        createdFoodTruck.name.should.equal('The Worst Wurst');
        done();
      });
    });
  });

  describe('#find()', function () {
    it('should find the foodtruck', function (done) {
      FoodTruck.collection.insert(foodtruck);

      FoodTruck.findOne(function (err, foundFoodTruck) {
        should.not.exist(err);
        
        foundFoodTruck.name.should.equal('The Worst Wurst');
        done();
      });
    });
  });

});
