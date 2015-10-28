var utils = require('../utils');
var request = require('supertest');
var Brewery = require('../../models/brewery');
var express = require('express');
var app = express();

describe('Brewery API endpoint', function(done) {

  var brewery = {
    name: "Whiskey With An E",
    address: "123 Lol St, Seattle, WA 98104",
    contact: {
      website: "http://whikeywithane.com/",
      facebook: "https://www.facebook.com/whiskeywithane",
      twitter_link: "https://twitter.com/whiskeywithane",
      twitter_screen_name: "whiskeywithane"
    },
    geometry: {
      coordinates: [
        -122.12345,
        47.12345
      ],
      type: "Point"
    }
  };

  app.get('/api/brewery', function(req, res){
    Brewery.collection.insert(brewery);

    Brewery.findOne().exec(function(err, the_brewery) {
        if (err) {
          res.send(err);
        }
        res.json(the_brewery);
      });
  });

  describe('GET /api/brewery', function(){
    it('respond with json', function(done){
      request(app)
        .get('/api/brewery')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, done);
    });
  });

});
