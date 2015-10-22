var express = require('express');
var router = express.Router();
var dotenv  = require('dotenv');
dotenv.load();

var GOOGLE_KEY = process.env.GOOGLE_KEY;

// var MongoClient = require('mongodb').MongoClient;

var json_foodtrucks;

var FoodTruck = require('../models/foodtruck');

/* GET home page. */
router.get('/', function(req, res, next) {

  FoodTruck.find(function(err, foodtrucks) {
    if (err) {
      res.send(err);
    }

    // res.json(foodtrucks);
    json_foodtrucks = JSON.stringify(foodtrucks);

    // res.render('index', { title : 'express', json: json_foodtrucks });
    res.render('index', { GOOGLE_KEY: GOOGLE_KEY });
  });
});

module.exports = router;
