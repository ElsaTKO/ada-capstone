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

var old_food_trucks = require('./food_trucks_data_2015-10-16T23:33:01.747Z');
var map_old_new_addresses = {};
var new_food_trucks = [];

var zero_results = [];
var many_or_error_results = [];

function wrapper(do_stuff, wrapperCallback) {
  wrapperCallback();
}

function monday(do_stuff, mondayCallback) {
  mondayCallback();
}

function tuesday(do_stuff, tuesdayCallback) {
  tuesdayCallback();
}

function wednesday(do_stuff, wednesdayCallback) {
  wednesdayCallback();
}

function thursday(do_stuff, thursdayCallback) {
  thursdayCallback();
}

function friday(do_stuff, fridayCallback) {
  fridayCallback();
}

function saturday(do_stuff, saturdayCallback) {
  saturdayCallback();
}

function sunday(do_stuff, sundayCallback) {
  sundayCallback();
}

function requestGeocode(address, callback) {
  address_replaced = address.replace(/\s/g, "+");
  url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + address_replaced + '&bounds=47.4955511,-122.4359085|47.734145,-122.2359031&key=' + GOOGLE_KEY;
  // wait a bit to not overload api limit

  request(url, function hitGoogleApi(error, response) {
		if (error) {
			console.error("\n***REQUEST ERROR: ", error);
		} else {
      // console.log("\n*REQUESTED URL: ", url);
      sleep.usleep(250000);
      callback(response.body);
    }
  });
}

app.get('/google', function openConnection(req, res) {

  async.forEachOfSeries(old_food_trucks, function iterator(truck_json, index, iteratorCallback) {
    console.log("INDEX ", index);
    if (index == old_food_trucks.length-1 ) {
      return iteratorCallback();
    }

    // create new food truck object
    new_food_trucks[index] = truck_json;
    console.log("\n*NEW FOOD TRUCK " + index + "\n", new_food_trucks[index].name);

    var lng, lat;
    var old_address, new_address;

    // for each truck, check each weekday schedule
    // MONDAY
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

        monday(requestGeocode(new_address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            // console.log("\n*RESPONSE: \n", response);
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
            console.log("*API call");
            // console.log("*Formatted address? ", new_food_trucks[index].schedule.monday.address);
          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            // console.log("\n*Response: \n", parsed_response);
            if (parsed_response.status === "ZERO_RESULTS") {
              zero_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***ZERO RESULTS: \n", zero_results);
            } else {
              many_or_error_results.push([ new_food_trucks[index].name, new_address, parsed_response ]);
              console.log("***MANY OR ERROR RESULTS: \n", many_or_error_results);
            }
          } // end assignments
          // append file
          fs.writeFile('async_trucks'+timestamp+'.json', JSON.stringify(new_food_trucks, null, 2), function (err) {
            if (err) throw err;
          });
        }), function(){
          console.log("*monday");
        });
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

    // TUESDAY
    if (new_food_trucks[index].schedule.tuesday.address !== undefined) {
      // has the address been queried already?
      if (map_old_new_addresses["" + new_food_trucks[index].schedule.tuesday.address + ""] === undefined) {
        // set url address
        old_address = new_food_trucks[index].schedule.tuesday.address;
        // extra info at end of address? if so, cut it off
        if (old_address.slice(-2) !== " N" && old_address.slice(-2) !== " S" && old_address.slice(-2) !== " E" && old_address.slice(-2) !== " W" && old_address.slice(-2) !== "NE" && old_address.slice(-2) !== "NW" && old_address.slice(-2) !== "SE" && old_address.slice(-2) !== "SW"  && old_address.slice(-2) !== "St" && old_address.slice(-2) !== "ve" && (old_address.indexOf(", ") !== -1)) {
          // format address for passing to requestGeocode
          new_address = old_address.split(", ")[0];
        } else {
          new_address = old_address;
        }

        tuesday(requestGeocode(new_address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            // console.log("\n*RESPONSE: \n", response);
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
            new_food_trucks[index].schedule.tuesday["geometry"] = {};
            new_food_trucks[index].schedule.tuesday["geometry"]["coordinates"] = [lng, lat];
            new_food_trucks[index].schedule.tuesday["geometry"]["type"] = "Point";
            // assign formatted address to new truck
            new_food_trucks[index].schedule.tuesday.address = data.formatted_address;
            console.log("*API call");
            // console.log("*Formatted address? ", new_food_trucks[index].schedule.tuesday.address);
          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            // console.log("\n*Response: \n", parsed_response);
            if (parsed_response.status === "ZERO_RESULTS") {
              zero_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***ZERO RESULTS: \n", zero_results);
            } else {
              many_or_error_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***MANY OR ERROR RESULTS: \n", many_or_error_results);
            }
          } // end assignments
          // append file
          fs.writeFile('async_trucks'+timestamp+'.json', JSON.stringify(new_food_trucks, null, 2), function (err) {
            if (err) throw err;
          });
        }), function(){
          console.log("*tuesday");
        });
      } else {
        // the address has already been queried
        // assign formatted address and [lng, lat] based on map's key value
        // "old address" = ["new address", [lng, lat]]
        // "new address": [0][0];
        // coordinates: [0][1];
        new_food_trucks[index].schedule.tuesday["geometry"] = {};
        new_food_trucks[index].schedule.tuesday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[index].schedule.tuesday.address + ""][0][1];
        new_food_trucks[index].schedule.tuesday["geometry"]["type"] = "Point";
        new_food_trucks[index].schedule.tuesday.address = map_old_new_addresses["" + new_food_trucks[index].schedule.tuesday.address + ""][0][0];
      } // end query vs map assignment
    } // end tuesday

    // WEDNESDAY
    if (new_food_trucks[index].schedule.wednesday.address !== undefined) {
      // has the address been queried already?
      if (map_old_new_addresses["" + new_food_trucks[index].schedule.wednesday.address + ""] === undefined) {
        // set url address
        old_address = new_food_trucks[index].schedule.wednesday.address;
        // extra info at end of address? if so, cut it off
        if (old_address.slice(-2) !== " N" && old_address.slice(-2) !== " S" && old_address.slice(-2) !== " E" && old_address.slice(-2) !== " W" && old_address.slice(-2) !== "NE" && old_address.slice(-2) !== "NW" && old_address.slice(-2) !== "SE" && old_address.slice(-2) !== "SW"  && old_address.slice(-2) !== "St" && old_address.slice(-2) !== "ve" && (old_address.indexOf(", ") !== -1)) {
          // format address for passing to requestGeocode
          new_address = old_address.split(", ")[0];
        } else {
          new_address = old_address;
        }

        wednesday(requestGeocode(new_address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            // console.log("\n*RESPONSE: \n", response);
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
            new_food_trucks[index].schedule.wednesday["geometry"] = {};
            new_food_trucks[index].schedule.wednesday["geometry"]["coordinates"] = [lng, lat];
            new_food_trucks[index].schedule.wednesday["geometry"]["type"] = "Point";
            // assign formatted address to new truck
            new_food_trucks[index].schedule.wednesday.address = data.formatted_address;
            console.log("*API call");
            // console.log("*Formatted address? ", new_food_trucks[index].schedule.wednesday.address);
          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            // console.log("\n*Response: \n", parsed_response);
            if (parsed_response.status === "ZERO_RESULTS") {
              zero_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***ZERO RESULTS: \n", zero_results);
            } else {
              many_or_error_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***MANY OR ERROR RESULTS: \n", many_or_error_results);
            }
          } // end assignments
          // append file
          fs.writeFile('async_trucks'+timestamp+'.json', JSON.stringify(new_food_trucks, null, 2), function (err) {
            if (err) throw err;
          });
        }), function(){
          console.log("*wednesday");
        });
      } else {
        // the address has already been queried
        // assign formatted address and [lng, lat] based on map's key value
        // "old address" = ["new address", [lng, lat]]
        // "new address": [0][0];
        // coordinates: [0][1];
        new_food_trucks[index].schedule.wednesday["geometry"] = {};
        new_food_trucks[index].schedule.wednesday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[index].schedule.wednesday.address + ""][0][1];
        new_food_trucks[index].schedule.wednesday["geometry"]["type"] = "Point";
        new_food_trucks[index].schedule.wednesday.address = map_old_new_addresses["" + new_food_trucks[index].schedule.wednesday.address + ""][0][0];
      } // end query vs map assignment
    } // end wednesday

    // THURSDAY
    if (new_food_trucks[index].schedule.thursday.address !== undefined) {
      // has the address been queried already?
      if (map_old_new_addresses["" + new_food_trucks[index].schedule.thursday.address + ""] === undefined) {
        // set url address
        old_address = new_food_trucks[index].schedule.thursday.address;
        // extra info at end of address? if so, cut it off
        if (old_address.slice(-2) !== " N" && old_address.slice(-2) !== " S" && old_address.slice(-2) !== " E" && old_address.slice(-2) !== " W" && old_address.slice(-2) !== "NE" && old_address.slice(-2) !== "NW" && old_address.slice(-2) !== "SE" && old_address.slice(-2) !== "SW"  && old_address.slice(-2) !== "St" && old_address.slice(-2) !== "ve" && (old_address.indexOf(", ") !== -1)) {
          // format address for passing to requestGeocode
          new_address = old_address.split(", ")[0];
        } else {
          new_address = old_address;
        }

        thursday(requestGeocode(new_address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            // console.log("\n*RESPONSE: \n", response);
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
            new_food_trucks[index].schedule.thursday["geometry"] = {};
            new_food_trucks[index].schedule.thursday["geometry"]["coordinates"] = [lng, lat];
            new_food_trucks[index].schedule.thursday["geometry"]["type"] = "Point";
            // assign formatted address to new truck
            new_food_trucks[index].schedule.thursday.address = data.formatted_address;
            console.log("*API call");
            // console.log("*Formatted address? ", new_food_trucks[index].schedule.thursday.address);
          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            // console.log("\n*Response: \n", parsed_response);
            if (parsed_response.status === "ZERO_RESULTS") {
              zero_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***ZERO RESULTS: \n", zero_results);
            } else {
              many_or_error_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***MANY OR ERROR RESULTS: \n", many_or_error_results);
            }
          } // end assignments
          // append file
          fs.writeFile('async_trucks'+timestamp+'.json', JSON.stringify(new_food_trucks, null, 2), function (err) {
            if (err) throw err;
          });
        }), function(){
          console.log("*thursday");
        });
      } else {
        // the address has already been queried
        // assign formatted address and [lng, lat] based on map's key value
        // "old address" = ["new address", [lng, lat]]
        // "new address": [0][0];
        // coordinates: [0][1];
        new_food_trucks[index].schedule.thursday["geometry"] = {};
        new_food_trucks[index].schedule.thursday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[index].schedule.thursday.address + ""][0][1];
        new_food_trucks[index].schedule.thursday["geometry"]["type"] = "Point";
        new_food_trucks[index].schedule.thursday.address = map_old_new_addresses["" + new_food_trucks[index].schedule.thursday.address + ""][0][0];
      } // end query vs map assignment
    } // end thursday

    // FRIDAY
    if (new_food_trucks[index].schedule.friday.address !== undefined) {
      // has the address been queried already?
      if (map_old_new_addresses["" + new_food_trucks[index].schedule.friday.address + ""] === undefined) {
        // set url address
        old_address = new_food_trucks[index].schedule.friday.address;
        // extra info at end of address? if so, cut it off
        if (old_address.slice(-2) !== " N" && old_address.slice(-2) !== " S" && old_address.slice(-2) !== " E" && old_address.slice(-2) !== " W" && old_address.slice(-2) !== "NE" && old_address.slice(-2) !== "NW" && old_address.slice(-2) !== "SE" && old_address.slice(-2) !== "SW"  && old_address.slice(-2) !== "St" && old_address.slice(-2) !== "ve" && (old_address.indexOf(", ") !== -1)) {
          // format address for passing to requestGeocode
          new_address = old_address.split(", ")[0];
        } else {
          new_address = old_address;
        }

        friday(requestGeocode(new_address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            // console.log("\n*RESPONSE: \n", response);
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
            new_food_trucks[index].schedule.friday["geometry"] = {};
            new_food_trucks[index].schedule.friday["geometry"]["coordinates"] = [lng, lat];
            new_food_trucks[index].schedule.friday["geometry"]["type"] = "Point";
            // assign formatted address to new truck
            new_food_trucks[index].schedule.friday.address = data.formatted_address;
            console.log("*API call");
            // console.log("*Formatted address? ", new_food_trucks[index].schedule.friday.address);
          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            // console.log("\n*Response: \n", parsed_response);
            if (parsed_response.status === "ZERO_RESULTS") {
              zero_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***ZERO RESULTS: \n", zero_results);
            } else {
              many_or_error_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***MANY OR ERROR RESULTS: \n", many_or_error_results);
            }
          } // end assignments
          // append file
          fs.writeFile('async_trucks'+timestamp+'.json', JSON.stringify(new_food_trucks, null, 2), function (err) {
            if (err) throw err;
          });
        }), function(){
          console.log("*friday");
        });
      } else {
        // the address has already been queried
        // assign formatted address and [lng, lat] based on map's key value
        // "old address" = ["new address", [lng, lat]]
        // "new address": [0][0];
        // coordinates: [0][1];
        new_food_trucks[index].schedule.friday["geometry"] = {};
        new_food_trucks[index].schedule.friday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[index].schedule.friday.address + ""][0][1];
        new_food_trucks[index].schedule.friday["geometry"]["type"] = "Point";
        new_food_trucks[index].schedule.friday.address = map_old_new_addresses["" + new_food_trucks[index].schedule.friday.address + ""][0][0];
      } // end query vs map assignment
    } // end friday

    // SATURDAY
    if (new_food_trucks[index].schedule.saturday.address !== undefined) {
      // has the address been queried already?
      if (map_old_new_addresses["" + new_food_trucks[index].schedule.saturday.address + ""] === undefined) {
        // set url address
        old_address = new_food_trucks[index].schedule.saturday.address;
        // extra info at end of address? if so, cut it off
        if (old_address.slice(-2) !== " N" && old_address.slice(-2) !== " S" && old_address.slice(-2) !== " E" && old_address.slice(-2) !== " W" && old_address.slice(-2) !== "NE" && old_address.slice(-2) !== "NW" && old_address.slice(-2) !== "SE" && old_address.slice(-2) !== "SW"  && old_address.slice(-2) !== "St" && old_address.slice(-2) !== "ve" && (old_address.indexOf(", ") !== -1)) {
          // format address for passing to requestGeocode
          new_address = old_address.split(", ")[0];
        } else {
          new_address = old_address;
        }

        saturday(requestGeocode(new_address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            // console.log("\n*RESPONSE: \n", response);
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
            new_food_trucks[index].schedule.saturday["geometry"] = {};
            new_food_trucks[index].schedule.saturday["geometry"]["coordinates"] = [lng, lat];
            new_food_trucks[index].schedule.saturday["geometry"]["type"] = "Point";
            // assign formatted address to new truck
            new_food_trucks[index].schedule.saturday.address = data.formatted_address;
            console.log("*API call");
            // console.log("*Formatted address? ", new_food_trucks[index].schedule.saturday.address);
          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            // console.log("\n*Response: \n", parsed_response);
            if (parsed_response.status === "ZERO_RESULTS") {
              zero_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***ZERO RESULTS: \n", zero_results);
            } else {
              many_or_error_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***MANY OR ERROR RESULTS: \n", many_or_error_results);
            }
          } // end assignments
          // append file
          fs.writeFile('async_trucks'+timestamp+'.json', JSON.stringify(new_food_trucks, null, 2), function (err) {
            if (err) throw err;
          });
        }), function(){
          console.log("*saturday");
        });
      } else {
        // the address has already been queried
        // assign formatted address and [lng, lat] based on map's key value
        // "old address" = ["new address", [lng, lat]]
        // "new address": [0][0];
        // coordinates: [0][1];
        new_food_trucks[index].schedule.saturday["geometry"] = {};
        new_food_trucks[index].schedule.saturday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[index].schedule.saturday.address + ""][0][1];
        new_food_trucks[index].schedule.saturday["geometry"]["type"] = "Point";
        new_food_trucks[index].schedule.saturday.address = map_old_new_addresses["" + new_food_trucks[index].schedule.saturday.address + ""][0][0];
      } // end query vs map assignment
    } // end saturday

    // SUNDAY
    if (new_food_trucks[index].schedule.sunday.address !== undefined) {
      // has the address been queried already?
      if (map_old_new_addresses["" + new_food_trucks[index].schedule.sunday.address + ""] === undefined) {
        // set url address
        old_address = new_food_trucks[index].schedule.sunday.address;
        // extra info at end of address? if so, cut it off
        if (old_address.slice(-2) !== " N" && old_address.slice(-2) !== " S" && old_address.slice(-2) !== " E" && old_address.slice(-2) !== " W" && old_address.slice(-2) !== "NE" && old_address.slice(-2) !== "NW" && old_address.slice(-2) !== "SE" && old_address.slice(-2) !== "SW"  && old_address.slice(-2) !== "St" && old_address.slice(-2) !== "ve" && (old_address.indexOf(", ") !== -1)) {
          // format address for passing to requestGeocode
          new_address = old_address.split(", ")[0];
        } else {
          new_address = old_address;
        }

        sunday(requestGeocode(new_address, function(response) {
          var parsed_response = JSON.parse(response);
          // just one good result?
          if (parsed_response.results.length === 1 && parsed_response.status === "OK") {
            // console.log("\n*RESPONSE: \n", response);
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
            new_food_trucks[index].schedule.sunday["geometry"] = {};
            new_food_trucks[index].schedule.sunday["geometry"]["coordinates"] = [lng, lat];
            new_food_trucks[index].schedule.sunday["geometry"]["type"] = "Point";
            // assign formatted address to new truck
            new_food_trucks[index].schedule.sunday.address = data.formatted_address;
            console.log("*API call");
            // console.log("*Formatted address? ", new_food_trucks[index].schedule.sunday.address);
          } else {
            console.log("\n***There's more than one result! Or an error...\n");
            // console.log("\n*Response: \n", parsed_response);
            if (parsed_response.status === "ZERO_RESULTS") {
              zero_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***ZERO RESULTS: \n", zero_results);
            } else {
              many_or_error_results.push([ new_food_trucks[index].name, new_address ]);
              console.log("***MANY OR ERROR RESULTS: \n", many_or_error_results);
            }
          } // end assignments
          // append file
          fs.writeFile('async_trucks'+timestamp+'.json', JSON.stringify(new_food_trucks, null, 2), function (err) {
            if (err) throw err;
          });
        }), function(){
          console.log("*sunday");
        });
      } else {
        // the address has already been queried
        // assign formatted address and [lng, lat] based on map's key value
        // "old address" = ["new address", [lng, lat]]
        // "new address": [0][0];
        // coordinates: [0][1];
        new_food_trucks[index].schedule.sunday["geometry"] = {};
        new_food_trucks[index].schedule.sunday["geometry"]["coordinates"] = map_old_new_addresses["" + new_food_trucks[index].schedule.sunday.address + ""][0][1];
        new_food_trucks[index].schedule.sunday["geometry"]["type"] = "Point";
        new_food_trucks[index].schedule.sunday.address = map_old_new_addresses["" + new_food_trucks[index].schedule.sunday.address + ""][0][0];
      } // end query vs map assignment
    } // end sunday


    // do something
      // if (err) return callback(err);

    // done with iteration
      iteratorCallback();
  }, function() {

    // console.log("\n*CREATED MAP: \n", map_old_new_addresses);
    //
    // // console.log(new_food_trucks);
    // fs.writeFile('async_trucks.json', JSON.stringify(new_food_trucks, null, 2), function writingFile(err) {
    //   if (err) {
    //     console.error(err);
    //   } else {
    //     console.log("\n*WRITE FILE SUCCESS.");
    //   }
    // }); // end write file
  }); // end forEachOfSeries doneLooping
});

app.listen('3000');
console.log('*Google API port open.');
exports = module.exports = app;
