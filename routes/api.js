var express = require('express');
var router = express.Router();

var FoodTruck = require('../models/foodtruck');
// var Brewery = require('../models/brewery');
// var Distillery = require('../models/distillery');

/* GET api foodtrucks. */
router.get('/foodtrucks', function(req, res, next) {

  FoodTruck.find(function(err, foodtrucks) {
    if (err) {
      res.send(err);
    }

    res.json(foodtrucks);
  });
});

/* GET api breweries. */

/* GET api distilleries. */

module.exports = router;
