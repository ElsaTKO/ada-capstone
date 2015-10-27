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
      // Create a Distillery object to pass to Distillery.create()
      Distillery.create(distillery, function (err, createdDistillery) {
        // Confirm that that an error does not exist
        should.not.exist(err);
        // verify that the returned user is what we expect
        createdDistillery.name.should.equal('Whiskey With An E');
        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });

});
