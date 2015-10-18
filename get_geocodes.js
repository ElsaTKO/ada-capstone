var express = require('express');
var fs      = require('fs');
var request = require('request');
var sleep   = require('sleep');
var app     = express();
var dotenv  = require('dotenv');
dotenv.load();

var GOOGLE_KEY = process.env.GOOGLE_KEY;

// https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY

// http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=GOOGLE_KEY

// test truck
var address = "5th Ave and Union St";
var address_replaced = address.replace(/\s/g, "+");

var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&key=' + GOOGLE_KEY;

function requestGeocode(address, callback) {
  request(url, function(error, response) {
		if (error) {
			console.log("REQUEST ERROR: ", error);
		} else {
      console.log(url);
      console.log("Requested geocode.");
      callback(response.body);
    }
  });
}

app.get('/google', function(req, res) {

  requestGeocode(address_replaced, function(response) {
    console.log(response);
    console.log("Done.");
  });
});

app.listen('3000');
console.log('Google API port open.');
exports = module.exports = app;



// function mySandwich(param1, param2, callback) {
//     alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
//     callback();
// }
//
// mySandwich('ham', 'cheese', function() {
//     alert('Finished eating my sandwich.');
// });
