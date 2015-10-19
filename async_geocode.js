var express = require('express');
var fs      = require('fs');
var request = require('request');
var sleep   = require('sleep');
var async   = require('async');
var app     = express();
var dotenv  = require('dotenv');
dotenv.load();

var GOOGLE_KEY = process.env.GOOGLE_KEY;
var old_food_trucks = require('./food_trucks_data_2015-10-16T23:33:01.747Z');
var map_old_new_addresses = {};
var new_food_trucks = [];

function requestGeocode(address, callback) {
  address_replaced = address.replace(/\s/g, "+");
  url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;

  request(url, function hitGoogleApi(error, response) {
		if (error) {
			console.log("\n***REQUEST ERROR: ", error);
		} else {
      console.log("\n*REQUESTED URL: ", url);
      console.log("\n*REQUESTED GEOCODE: ");
      callback(response.body);
    }
  });
}

app.get('/google', function openConnection(req, res) {

  async.forEachOfSeries(old_food_trucks, function iterator(truck_json, index, iteratorCallback) {

    if (index >= 3) {
      return iteratorCallback();
    }

    // create new food truck object
    new_food_trucks[index] = truck_json;
    console.log("\n*NEW FOOD TRUCK " + index + "\n", new_food_trucks[index]);

    var lng, lat;
    var old_address, new_address;

    // for each truck, check each weekday schedule
    // monday
    if (new_food_trucks[index].schedule.monday.address !== undefined) {
      // has the address been queried already?
      if (map_old_new_addresses["" + new_food_trucks[index].schedule.monday.address + ""] === undefined) {
        // set url address
        old_address = new_food_trucks[index].schedule.monday.address;
        // extra info at end of address? if so, cut it off
        if (old_address.slice(-2) !== " N" && old_address.slice(-2) !== " S" && old_address.slice(-2) !== " E" && old_address.slice(-2) !== " W" && old_address.slice(-2) !== "NE" && old_address.slice(-2) !== "NW" && old_address.slice(-2) !== "SE" && old_address.slice(-2) !== "SW"  && old_address.slice(-2) !== "St" && old_address.slice(-2) !== "ve" && (old_address.indexOf(", ") !== -1)) {
          // format address for passing to requestGeocode
          new_address = old_address.split(", ")[0];
        } else {
          new_address = old_address;
        }
        // wait a bit to not overload api limit
        sleep.usleep(150000);
        requestGeocode(new_address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            console.log("\n*RESPONSE: \n", response);
            // get the returned data
            var data = parsed_response.results[0];
            lng = data.geometry.location.lng;
            lat = data.geometry.location.lat;

            // create map for old and new address, to avoid redundant api calls
            // "old address" = ["new address", [lng, lat]]
            // "new address": [0][0];
            // coordinates: [0][1];
            map_old_new_addresses["" + old_address + ""] = [ data.formatted_address, [lng, lat] ];


            // assign geojson lng and lat to new truck
            new_food_trucks[index].schedule.monday["geometry"] = {};
            new_food_trucks[index].schedule.monday["geometry"]["coordinates"] = [lng, lat];
            new_food_trucks[index].schedule.monday["geometry"]["type"] = "Point";
            // assign formatted address to new truck
            new_food_trucks[index].schedule.monday.address = data.formatted_address;

          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            console.log("\n*Response: \n", parsed_response);
            if (parsed_response.status === "ZERO_RESULTS") {
              throw "ZERO_RESULTS";
            } else {
              throw "\n***There's more than one result! Or an error...";
            }
          } // end assignments
        }); // end api request
      } else {
        // the address has already been queried
        // assign formatted address and [lng, lat] based on map's key value
        // "old address" = ["new address", [lng, lat]]
        // "new address": [0][0];
        // coordinates: [0][1];
        new_food_trucks[index].schedule.monday["geometry"] = {};
        new_food_trucks[index].schedule.monday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[index].schedule.monday.address + ""][0][1];
        new_food_trucks[index].schedule.monday["geometry"]["type"] = "Point";
        new_food_trucks[index].schedule.monday.address = map_old_new_addresses["" + new_food_trucks[index].schedule.monday.address + ""][0][0];
      } // end query vs map assignment
    } // end monday



    // do something
      // if (err) return callback(err);

    // done with iteration
      iteratorCallback();
  }, function doneLooping(err) {
    if (err) console.error(err);

    console.log("\n*CREATED MAP: \n", map_old_new_addresses);

    // console.log(new_food_trucks);
    fs.writeFile('async_trucks.json', JSON.stringify(new_food_trucks, null, 2), function writingFile(err) {
      if (err) {
        console.error(err);
      } else {
        console.log("\n*WRITE FILE SUCCESS.");
      }
    }); // end write file
  }); // end forEachOfSeries doneLooping
});

app.listen('3000');
console.log('*Google API port open.');
exports = module.exports = app;



// async.eachSeries(hugeArray, function iterator(item, callback) {
//   if (inCache(item)) {
//     async.setImmediate(function () {
//       callback(null, cache[item]);
//     });
//   } else {
//     doSomeIO(item, callback);
//   //...

// var obj = {dev: "/dev.json", test: "/test.json", prod: "/prod.json"};
// var configs = {};
// async.forEachOf(obj, function (value, key, callback) {
//   fs.readFile(__dirname + value, "utf8", function (err, data) {
//     if (err) return callback(err);
//     try {
//       configs[key] = JSON.parse(data);
//     } catch (e) {
//       return callback(e);
//     }
//     callback();
//   })
// }, function (err) {
//   if (err) console.error(err.message);
//   // configs is now a map of JSON data
//   doSomethingWith(configs);
// })

// function requestGeocode(food_truck, address, callback) {
//   address_replaced = address.replace(/\s/g, "+");
//   url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;
//
//   request(url, function(error, response) {
// 		if (error) {
// 			console.log("\n***REQUEST ERROR: ", error);
// 		} else {
//       console.log("\n*REQUESTED URL: ", url);
//       console.log("\n*REQUESTED GEOCODE: ");
//       callback(response.body);
//     }
//   });
// }
//
// var old_food_trucks = require('./food_trucks_data_2015-10-16T23:33:01.747Z');
// // old_food_trucks = JSON.parse(old_food_trucks); // maybe?
// var map_old_new_addresses = {};
// var new_food_trucks = [];
// var lng, lat;
//
// app.get('/google', function(req, res) {
//
//   // loop through all food_trucks
//     // push each truck into new object collection
//     // for each truck, look at each weekday address
//       // if there is an address for a weekday, set address to api request url and send query
//       // if no errors and just one result, create geojson keys on new object
//   // write object collection to new file
//
//
//   // loop through all food trucks from scraped file
//   for (i = 0; i < old_food_trucks.length; i++) {
//
//     // DEBUG
//     if (i === 1) {
//       continue;
//     }
//     if (i === 2) {
//       break;
//     }
//
//     // console.log("i = ", i);
//     // continue;
//
//     // add each old truck object to new object collection
//     new_food_trucks[i] = old_food_trucks[i];
//     console.log(new_food_trucks[i].schedule.monday.address);
//
//     // for each truck, check each weekday schedule
//     if (new_food_trucks[i].schedule.monday.address !== undefined) {
//       // has the address been queried already?
//       if (map_old_new_addresses["" + new_food_trucks[i].schedule.monday.address + ""] === undefined && new_food_trucks[i] !== undefined) {
//         // set url address (for address_replaced)
//         address = new_food_trucks[i].schedule.monday.address;
//         // extra info at end of address? if so, cut it off
//         if (address.slice(-2) !== " N" && address.slice(-2) !== " S" && address.slice(-2) !== " E" && address.slice(-2) !== " W" && address.slice(-2) !== "NE" && address.slice(-2) !== "NW" && address.slice(-2) !== "SE" && address.slice(-2) !== "SW"  && address.slice(-2) !== "St" && address.slice(-2) !== "ve" && (address.indexOf(", ") !== -1)) {
//           address = address.split(", ")[0];
//         }
//         // address_replaced = address.replace(/\s/g, "+");
//         // query google api
//
//         if (address === undefined) {
//           throw "***UNDEFINED ADDRESS";
//         }
//
//         requestGeocode(new_food_trucks[i], address, function(response) {
//           if (new_food_trucks[i] === undefined) {
//             throw "***UNDEFINED FOOD TRUCK";
//           }
//           var parsed_response = JSON.parse(response);
//           // just one good result?
//           if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
//             console.log(response);
//             // get the returned data
//             var data = parsed_response.results[0];
//             lng = data.geometry.location.lng;
//             lat = data.geometry.location.lat;
//
//             // create map for old and new address, to avoid redundant api calls
//             // "old address" = ["new address", [lng, lat]]
//             // "new address": [0][0];
//             // coordinates: [0][1];
//             sleep.sleep(1);
//             map_old_new_addresses["" + new_food_trucks[i].schedule.monday.address + ""] = [ data.formatted_address, [lng, lat] ];
//             console.log("*CREATED MAP: ", map_old_new_addresses);
//
//             // assign geojson lng and lat to new truck
//             new_food_trucks[i].schedule.monday["geometry"]["coordinates"] = [lng, lat];
//             new_food_trucks[i].schedule.monday["geometry"]["type"] = "Point";
//             // assign formatted address to new truck
//             new_food_trucks[i].schedule.monday.address = data.formatted_address;
//           } else {
//             console.log("\n***There's more than one result! Or an error...\n");
//             console.log("\n*Response: \n", parsed_response);
//             if (parsed_response.status === "ZERO_RESULTS") {
//               console.log("\n***ZERO RESULTS.");
//               return;
//             } else {
//               throw "\n***There's more than one result! Or an error...";
//             }
//
//           } // end assignments
//           // console.log("*Done.");
//         }); // end api request
//       } else { // the address has already been queried
//         // assign formatted address and [lng, lat] based on map's key value
//         // "old address" = ["new address", [lng, lat]]
//         // "new address": [0][0];
//         // coordinates: [0][1];
//         new_food_trucks[i].schedule.monday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[i].schedule.monday.address][0][1];
//         new_food_trucks[i].schedule.monday["geometry"]["type"] = "Point";
//         new_food_trucks[i].schedule.monday.address = map_old_new_addresses["" + new_food_trucks[i].schedule.monday.address + ""][0][0];
//       } // end query vs map assignment
//     } // end monday
//
//
//
//     // if (new_food_trucks[i].schedule.tuesday.address !== undefined) {
//     //
//     // } // end tuesday
//     // if (new_food_trucks[i].schedule.wednesday.address !== undefined) {
//     //
//     // } // end wednesday
//     // if (new_food_trucks[i].schedule.thursday.address !== undefined) {
//     //
//     // } // end thursday
//     // if (new_food_trucks[i].schedule.friday.address !== undefined) {
//     //
//     // } // end friday
//     // if (new_food_trucks[i].schedule.saturday.address !== undefined) {
//     //
//     // } // end saturday
//     // if (new_food_trucks[i].schedule.sunday.address !== undefined) {
//     //
//     // } // end sunday
//
//     console.log("\n*NEW TRUCK " + i +" (after weekdays): \n", new_food_trucks[i]);
//
//   } // end for loop
//
//   console.log("*MAP: \n", map_old_new_addresses);
//
//   // write file
//   console.log("\n*END OF LOOP.");
//   fs.writeFile('foood_geo.json', JSON.stringify(new_food_trucks, null, 2), function(err){
//     if (err) {
//       console.log("\n***WRITE FILE ERROR: ", err);
//     } else {
//       console.log("\n*WRITE FILE SUCCESS.");
//     }
//   });
//
// });
//
// app.listen('3000');
// console.log('*Google API port open.');
// exports = module.exports = app;

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
