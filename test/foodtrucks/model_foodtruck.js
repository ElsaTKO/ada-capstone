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
      // Create a FoodTruck object to pass to FoodTruck.create()
      FoodTruck.create(foodtruck, function (err, createdFoodTruck) {
        // Confirm that that an error does not exist
        should.not.exist(err);
        // verify that the returned user is what we expect
        createdFoodTruck.name.should.equal('The Worst Wurst');
        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });

});
