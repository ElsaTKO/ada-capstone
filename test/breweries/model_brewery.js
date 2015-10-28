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
      Brewery.create(brewery, function (err, createdBrewery) {
        should.not.exist(err);

        createdBrewery.name.should.equal('Brew Eerie');
        done();
      });
    });
  });

  describe('#find()', function () {
    it('should find the brewery', function (done) {
      Brewery.collection.insert(brewery);

      Brewery.findOne(function (err, foundBrewery) {
        should.not.exist(err);

        foundBrewery.name.should.equal('Brew Eerie');
        done();
      });
    });
  });

});
