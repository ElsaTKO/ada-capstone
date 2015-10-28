var utils = require('../utils');
var request = require('supertest');
var FoodTruck = require('../../models/foodtruck');
var express = require('express');
var app = express();

describe('FoodTruck API endpoint', function(done) {

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

  app.get('/api/foodtruck', function(req, res){
    FoodTruck.collection.insert(foodtruck);

    FoodTruck.findOne().exec(function(err, the_foodtruck) {
        if (err) {
          res.send(err);
        }
        res.json(the_foodtruck);
      });
  });

  describe('GET /api/foodtruck', function(){
    it('respond with json', function(done){
      request(app)
        .get('/api/foodtruck')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, done);
    });
  });

});
