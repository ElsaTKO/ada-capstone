var express = require('express');
var fs      = require('fs');
var request = require('request');
var sleep   = require('sleep');
var async   = require('async');
var app     = express();
var dotenv  = require('dotenv');
dotenv.load();

var GOOGLE_KEY = process.env.GOOGLE_DEV_KEY;

var new_date = new Date();
var timestamp = new_date.toJSON();

var old_breweries = require('./breweries_and_loc.json');
var old_distilleries = require('./distilleries_data.json');

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
    if (i < 30) { // FOR THIS INDEX
      continue;
    }
    // if (i > 29) { // FOR THIS INDEX
    //   return;
    // }
    new_brewery = old_breweries[i];
    createBreweryRequestFromAddress(new_brewery, i);
  }
}

function iterateDistilleries(old_distilleries) {
  for (i = 0; i < old_distilleries.length; i++) {
    // DEBUGGING
    if (i < 10) { // FOR THIS INDEX
      continue;
    }
    // if (i > 9) { // FOR THIS INDEX
    //   return;
    // }
    new_distillery = old_distilleries[i];
    createDistilleryRequestFromAddress(new_distillery, i);
  }
}

function createBreweryRequestFromAddress(brewery, index) {
  var street = brewery.street;
  var city = brewery.city;
  var state = brewery.state;
  var zip = brewery.zip;
  var address = brewery.street + ", " + city + ", " + state + " " + zip;
  var address_replaced = address.replace(/\s/g, "+");
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;

  hitGoogleApiForBrewery(url, brewery, index);
}

function createDistilleryRequestFromAddress(distillery, index) {
  var address = distillery.address;
  var address_replaced = address.replace(/\s/g, "+");
  var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;

  hitGoogleApiForDistillery(url, distillery, index);
}

function hitGoogleApiForBrewery(url, brewery, index) {
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        addBreweryGeoToJson(body, brewery, index);
    } else {
      throw error;
    }
  });
}

function hitGoogleApiForDistillery(url, distillery, index) {
  request(url, function(error, response, body) {
    if (!error && response.statusCode == 200) {
        addDistilleryGeoToJson(body, distillery, index);
    } else {
      throw error;
    }
  });
}

function addBreweryGeoToJson(body, brewery, index) {
  // console.log(data);
  var data = JSON.parse(body);
  console.log(data.results[0].formatted_address);
  console.log(data.results[0].geometry.location.lng);
  console.log(data.results[0].geometry.location.lat);
  if (data.results.length > 1) {
    brewery["geometry"] = {};
    brewery.geometry["coordinates"] = [];
    brewery.geometry["type"] = "Point";

    var possibilities = {};
    for (i = 0; i < data.results.length; i++) {
      var formatted_address = data.results[i].formatted_address;
      var lng = data.results[i].geometry.location.lng;
      var lat = data.results[i].geometry.location.lat;
      var lng_lat = [lng, lat];
      possibilities[""+ data.results[i].formatted_address +""] = lng_lat;
    }
    // console.log("*** " + brewery.name + " HAS MORE THAN ONE RESULT:\n", JSON.stringify(data.results, null, 2));
    console.log("*** ORIGINAL:\n", JSON.stringify(brewery, null, 2));
    console.log("*** PLEASE CHOOSE A RESULT:\n", JSON.stringify(possibilities, null, 2));
    writeBreweryToFile(brewery, index);
  } else {
    var result = data.results[0];

    var formatted_address = result.formatted_address;
    var lng = result.geometry.location.lng;
    var lat = result.geometry.location.lat;
    var lng_lat = [lng, lat];
    // brewery.address = formatted_address;
    brewery["geometry"] = {};
    brewery.geometry["coordinates"] = lng_lat;
    brewery.geometry["type"] = "Point";

    writeBreweryToFile(brewery, index);
  }
}

function addDistilleryGeoToJson(body, distillery, index) {
  // console.log(data);
  var data = JSON.parse(body);
  console.log(data.results[0].formatted_address);
  console.log(data.results[0].geometry.location.lng);
  console.log(data.results[0].geometry.location.lat);
  if (data.results.length > 1) {
    distillery["geometry"] = {};
    distillery.geometry["coordinates"] = [];
    distillery.geometry["type"] = "Point";

    var possibilities = {};
    for (i = 0; i < data.results.length; i++) {
      var formatted_address = data.results[i].formatted_address;
      var lng = data.results[i].geometry.location.lng;
      var lat = data.results[i].geometry.location.lat;
      var lng_lat = [lng, lat];
      possibilities[""+ data.results[i].formatted_address +""] = lng_lat;
    }
    console.log("*** ORIGINAL:\n", JSON.stringify(distillery, null, 2));
    console.log("*** PLEASE CHOOSE A RESULT:\n", JSON.stringify(possibilities, null, 2));
    writeDistilleryToFile(distillery, index);
  } else {
    var result = data.results[0];

    var formatted_address = result.formatted_address;
    var lng = result.geometry.location.lng;
    var lat = result.geometry.location.lat;
    var lng_lat = [lng, lat];
    // distillery.address = formatted_address;
    distillery["geometry"] = {};
    distillery.geometry["coordinates"] = lng_lat;
    distillery.geometry["type"] = "Point";

    writeDistilleryToFile(distillery, index);
  }
}

function writeBreweryToFile(brewery, index) {
  fs.writeFile('b' + index + "_" + timestamp + '.json', JSON.stringify(brewery, null, 2), function (err) {
    if (err) throw err;
  });
  console.log("\nDONE: BREWERY " + index);
}

function writeDistilleryToFile(distillery, index) {
  fs.writeFile('d' + index + "_" + timestamp + '.json', JSON.stringify(distillery, null, 2), function (err) {
    if (err) throw err;
  });
  console.log("\nDONE: DISTILLERY " + index);
}

app.get('/google', function openConnection(req, res) {

  // iterateBreweries(old_breweries);
  iterateDistilleries(old_distilleries);

});

app.listen('3000');
console.log('*Google API port open.');
exports = module.exports = app;
