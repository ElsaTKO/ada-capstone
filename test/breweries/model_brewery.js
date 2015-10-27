'use strict';

// import the moongoose helper utilities
var utils = require('../utils');
var should = require('should');
var Brewery = require('../../models/brewery');

describe('Brewery', function () {
  var brewery = {
    name: "Brew Eerie",
    address: "123 Lol St, Seattle, WA 98104",
    contact: {
      website: "http://breweerie.com/",
      facebook: "https://www.facebook.com/breweerie",
      twitter_link: "https://twitter.com/breweerie",
      twitter_screen_name: "breweerie"
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
    it('should create a new brewery', function (done) {
      // Create a Brewery object to pass to Brewery.create()
      Brewery.create(brewery, function (err, createdBrewery) {
        // Confirm that that an error does not exist
        should.not.exist(err);
        // verify that the returned user is what we expect
        createdBrewery.name.should.equal('Brew Eerie');
        // Call done to tell mocha that we are done with this test
        done();
      });
    });
  });

});
