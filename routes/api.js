var express = require('express');
var router = express.Router();

function determineWeekday() {
  var today = new Date();
  var weekday_integer = today.getDay(); // 0 for Sunday, 1 for Monday, etc
  var hour = today.getHours(); // 0 for midnight, 23:59 for 11:59pm

  // is it late night? food trucks might still be out from previous day
  if (hour >= 0 && hour <= 4) {
    // is it sunday? rewinding one day needs to be 6, not -1
    if (weekday_integer === 0) {
      weekday_integer = 6;
    } else {
      weekday_integer -= 1;
    }
  }

  var weekdayMap = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday"
  };
  var weekday = weekdayMap[weekday_integer];
  return weekday;
}

var FoodTruck = require('../models/foodtruck');
var Brewery = require('../models/brewery');
// var Distillery = require('../models/distillery');

/* GET api foodtrucks. */
router.get('/foodtrucks', function(req, res, next) {

  var weekday = determineWeekday();

  var query = {};
  query["schedule." + weekday + ".address"] = {$exists: true};

  FoodTruck.find(query).exec(function(err, foodtrucks) {
      if (err) {
        res.send(err);
      }
      res.json(foodtrucks);
    });
});

/* GET api breweries. */
router.get('/breweries', function(req, res, next) {
  Brewery.find(function(err, brewries) {
      if (err) {
        res.send(err);
      }
      res.json(brewries);
    });
});

/* GET api distilleries. */
router.get('/distilleries', function(req, res, next) {
  Distillery.find(function(err, distilleries) {
      if (err) {
        res.send(err);
      }
      res.json(distilleries);
    });
});

module.exports = router;
