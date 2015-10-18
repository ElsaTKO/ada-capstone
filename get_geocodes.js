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
// var address = "5th Ave and Union St";
// var address_replaced = address.replace(/\s/g, "+"); // "5th+Ave+and+Union+St"


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

var address, address_replaced, url;

// var url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;

function requestGeocode(address, callback) {
  address_replaced = address.replace(/\s/g, "+");
  url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;

  request(url, function(error, response) {
		if (error) {
			console.log("\n***REQUEST ERROR: ", error);
		} else {
      console.log("\n*REQUESTED URL: ", url);
      console.log("\n*REQUESTED GEOCODE: ");
      callback(response.body);
    }
  });
}

var old_food_trucks = require('./food_trucks_data_2015-10-16T23:33:01.747Z');
// old_food_trucks = JSON.parse(old_food_trucks); // maybe?
var map_old_new_addresses = {};
var new_food_trucks = [];
var lng, lat;

app.get('/google', function(req, res) {

  // loop through all food_trucks
    // push each truck into new object collection
    // for each truck, look at each weekday address
      // if there is an address for a weekday, set address to api request url and send query
      // if no errors and just one result, create geojson keys on new object
  // write object collection to new file


  // loop through all food trucks from scraped file
  for (i = 0; i < old_food_trucks.length; i++) {

    // DEBUG
    if (i === 1) {
      continue;
    }
    if (i === 2) {
      break;
    }

    // console.log("i = ", i);
    // continue;

    // add each old truck object to new object collection
    new_food_trucks[i] = old_food_trucks[i];
    console.log(new_food_trucks[i].schedule.monday.address);

    // for each truck, check each weekday schedule
    if (new_food_trucks[i].schedule.monday.address !== undefined) {
      // has the address been queried already?
      if (map_old_new_addresses["" + new_food_trucks[i].schedule.monday.address + ""] === undefined) {
        // set url address (for address_replaced)
        address = new_food_trucks[i].schedule.monday.address;
        // address_replaced = address.replace(/\s/g, "+");
        // query google api

        if (address === undefined) {
          throw "***UNDEFINED ADDRESS";
        }

        requestGeocode(address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            console.log(response);
            // get the returned data
            var data = parsed_response.results[0];
            lng = data.geometry.location.lng;
            lat = data.geometry.location.lat;

            // create map for old and new address, to avoid redundant api calls
            // "old address" = ["new address", [lng, lat]]
            // "new address": [0][0];
            // coordinates: [0][1];
            map_old_new_addresses["" + new_food_trucks[i].schedule.monday.address + ""] = [ data.formatted_address, [lng, lat] ];
            console.log("*CREATED MAP: ", map_old_new_addresses);

            // assign geojson lng and lat to new truck
            new_food_trucks[i].schedule.monday["geometry"]["coordinates"] = [lng, lat];
            new_food_trucks[i].schedule.monday["geometry"]["type"] = "Point";
            // assign formatted address to new truck
            new_food_trucks[i].schedule.monday.address = data.formatted_address;
          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            console.log("\n*Results: \n", parsed_response.results);
            throw "\n***There's more than one result! Or an error...";
          } // end assignments
          // console.log("*Done.");
        }); // end api request
      } else { // the address has already been queried
        // assign formatted address and [lng, lat] based on map's key value
        // "old address" = ["new address", [lng, lat]]
        // "new address": [0][0];
        // coordinates: [0][1];
        new_food_trucks[i].schedule.monday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[i].schedule.monday.address][0][1];
        new_food_trucks[i].schedule.monday["geometry"]["type"] = "Point";
        new_food_trucks[i].schedule.monday.address = map_old_new_addresses["" + new_food_trucks[i].schedule.monday.address + ""][0][0];
      } // end query vs map assignment
    } // end monday



    // if (new_food_trucks[i].schedule.tuesday.address !== undefined) {
    //
    // } // end tuesday
    // if (new_food_trucks[i].schedule.wednesday.address !== undefined) {
    //
    // } // end wednesday
    // if (new_food_trucks[i].schedule.thursday.address !== undefined) {
    //
    // } // end thursday
    // if (new_food_trucks[i].schedule.friday.address !== undefined) {
    //
    // } // end friday
    // if (new_food_trucks[i].schedule.saturday.address !== undefined) {
    //
    // } // end saturday
    // if (new_food_trucks[i].schedule.sunday.address !== undefined) {
    //
    // } // end sunday

    console.log("\n*NEW TRUCK " + i +" (after weekdays): \n", new_food_trucks[i]);

  } // end for loop

  sleep.sleep(3);
  console.log("*MAP: \n", map_old_new_addresses);

  // write file
  console.log("\n*END OF LOOP.");
  fs.writeFile('foood_geo.json', JSON.stringify(new_food_trucks, null, 2), function(err){
    if (err) {
      console.log("\n***WRITE FILE ERROR: ", err);
    }
      console.log("\n*WRITE FILE SUCCESS.");
    });

});

app.listen('3000');
console.log('*Google API port open.');
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
