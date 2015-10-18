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

// The latitudes and longitudes of southwest and northeast corners of Colorado, respectively.
    //  .setBounds(36.998166, -109.045486, 41.001666,-102.052002)

    // Seattle's coordinates
    // [[[-122.4359085,47.4955511],
    //   [-122.4359085,47.734145],
    //   [-122.2359031,47.734145],
    //   [-122.4359085,47.4955511],
    //   [-122.4359085,47.4955511]]]

    // SEATTLE BOUNDS
    // http://geojson.io/#map=10/47.7088/-122.3492
    // {
    //   "type": "FeatureCollection",
    //   "features": [
    //   { "type": "Feature",
    //         "geometry": {"type": "Point", "coordinates": [-122.4359085,47.4955511]},
    //         "properties": {"SW": "SW"}
    //         },
    //     { "type": "Feature",
    //         "geometry": {"type": "Point", "coordinates": [-122.2359031,47.734145]},
    //         "properties": {"NE": "NE"}
    //         }
    //   ]
    // }

// SW Seattle coordinates
// [-122.4359085,47.4955511]
// 47.4955511,-122.4359085

// NE Seattle coordinates
// [-122.2359031,47.734145]
// 47.734145,-122.2359031

// Seattel bounds
// &bounds=47.4955511,-122.4359085|47.734145,-122.2359031

var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;

function requestGeocode(address, callback) {
  sleep.sleep(1);
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

// RESPONSE
// {
//    "results" : [
//       {
//          "address_components" : [
//             {
//                "long_name" : "5th Avenue",
//                "short_name" : "5th Ave",
//                "types" : [ "route" ]
//             },
//             {
//                "long_name" : "Pike Pine Retail Core",
//                "short_name" : "Pike Pine Retail Core",
//                "types" : [ "neighborhood", "political" ]
//             },
//             {
//                "long_name" : "Seattle",
//                "short_name" : "Seattle",
//                "types" : [ "locality", "political" ]
//             },
//             {
//                "long_name" : "King County",
//                "short_name" : "King County",
//                "types" : [ "administrative_area_level_2", "political" ]
//             },
//             {
//                "long_name" : "Washington",
//                "short_name" : "WA",
//                "types" : [ "administrative_area_level_1", "political" ]
//             },
//             {
//                "long_name" : "United States",
//                "short_name" : "US",
//                "types" : [ "country", "political" ]
//             },
//             {
//                "long_name" : "98101",
//                "short_name" : "98101",
//                "types" : [ "postal_code" ]
//             }
//          ],
//          "formatted_address" : "5th Ave & Union St, Seattle, WA 98101, USA",
//          "geometry" : {
//             "location" : {
//                "lat" : 47.6096839,
//                "lng" : -122.334667
//             },
//             "location_type" : "APPROXIMATE",
//             "viewport" : {
//                "northeast" : {
//                   "lat" : 47.6110328802915,
//                   "lng" : -122.3333180197085
//                },
//                "southwest" : {
//                   "lat" : 47.6083349197085,
//                   "lng" : -122.3360159802915
//                }
//             }
//          },
//          "place_id" : "Eio1dGggQXZlICYgVW5pb24gU3QsIFNlYXR0bGUsIFdBIDk4MTAxLCBVU0E",
//          "types" : [ "intersection" ]
//       }
//    ],
//    "status" : "OK"
// }



// function mySandwich(param1, param2, callback) {
//     alert('Started eating my sandwich.\n\nIt has: ' + param1 + ', ' + param2);
//     callback();
// }
//
// mySandwich('ham', 'cheese', function() {
//     alert('Finished eating my sandwich.');
// });
