var express = require('express');
var fs      = require('fs');
var request = require('request');
var sleep   = require('sleep');
var async   = require('async');
var app     = express();
var dotenv  = require('dotenv');
dotenv.load();

var GOOGLE_KEY = process.env.GOOGLE_KEY;

var new_date = new Date();
var timestamp = new_date.toJSON();

var old_breweries = require('./breweries_and_loc.json');
var new_breweries = [];
// var old_distilleries = require('./distilleries_and_loc.json');

// {
//   "name": "Georgetown Brewing Company",
//   "street": "5840 Airport Way S #201",
//   "city": "Seattle",
//   "state": "WA",
//   "zip": "98108",
//   "address": "5840 Airport Way S #201, Seattle, WA 98108"
// }

// geocode addresses
  // (if have time) lookup google places reference?
    // (if have time) get business hours for days of week?



function iterateBreweries(old_breweries) {
  for (i = 0; i < old_breweries.length; i++) {
    // DEBUGGING
    if (i < 0) { // FOR THIS INDEX
      continue;
    }
    if (i > 0) { // FOR THIS INDEX
      return;
    }
    new_brewery = old_breweries[i];
    createRequestFromAddress(new_brewery, i);
  }
}

function createRequestFromAddress(brewery, index) {
  var street = brewery.street;
  var city = brewery.city;
  var state = brewery.state;
  var zip = brewery.zip;
  var address = brewery.street + ", " + city + ", " + state + " " + zip;
  var address_replaced = address.replace(/\s/g, "+");
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;

  hitGoogleApi(url, brewery, index);
}

function hitGoogleApi(url, brewery, index) {
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        addGeoToJson(body, brewery, index);
    } else {
      throw error;
    }
  });
}

function addGeoToJson(body, brewery, index) {
  // console.log(data);
  var data = JSON.parse(body);
  console.log(data.results[0].formatted_address);
  console.log(data.results[0].geometry.location.lng);
  console.log(data.results[0].geometry.location.lat);
  if (data.results.length > 1) {
    console.log("*** " + brewery.name + " HAS MORE THAN ONE RESULT:\n", body);
    console.log("*** PLEASE CHOOSE A RESULT. ORIGINAL:\n", brewery);
  } else {
    var result = data.results[0];

    var formatted_address = result.formatted_address;
    var lng = result.geometry.location.lng;
    var lat = result.geometry.location.lat;
    var lng_lat = [lng, lat];

    brewery["geometry"] = {};
    brewery.geometry["coordinates"] = lng_lat;
    brewery.geomtry["type"] = "Point";

    writeBreweryToFile(brewery, index);
  }
}

function writeBreweryToFile(brewery, index) {
  fs.writeFile('b' + index + "_" + timestamp + '.json', JSON.stringify(brewery, null, 2), function (err) {
    if (err) throw err;
  });
  console.log("DONE with brewery" + index);
}

app.get('/google', function openConnection(req, res) {

  iterateBreweries(old_breweries);

});

app.listen('3000');
console.log('*Google API port open.');
exports = module.exports = app;
