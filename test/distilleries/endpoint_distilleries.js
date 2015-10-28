var utils = require('../utils');
var request = require('supertest');
var Distillery = require('../../models/distillery');
var express = require('express');
var app = express();

describe('Distillery API endpoint', function(done) {

  var distillery = {
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

  app.get('/api/distillery', function(req, res){
    Distillery.collection.insert(distillery);

    Distillery.findOne().exec(function(err, the_distillery) {
        if (err) {
          res.send(err);
        }
        res.json(the_distillery);
      });
  });

  describe('GET /api/distillery', function(){
    it('respond with json', function(done){
      request(app)
        .get('/api/distillery')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/, done);
    });
  });

});
