'use strict';

// import the moongoose helper utilities
var utils = require('../utils');
var should = require('should');
var Distillery = require('../../models/distillery');

describe('Distillery', function () {
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

  describe('#create()', function () {
    it('should create a new distillery', function (done) {
      Distillery.create(distillery, function (err, createdDistillery) {
        should.not.exist(err);

        createdDistillery.name.should.equal('Whiskey With An E');
        done();
      });
    });
  });

  describe('#find()', function () {
    it('should find the distillery', function (done) {
      Distillery.collection.insert(distillery);

      Distillery.findOne(function (err, foundDistillery) {
        should.not.exist(err);
        
        foundDistillery.name.should.equal('Whiskey With An E');
        done();
      });
    });
  });

});
