var express = require('express');
var router = express.Router();
var dotenv  = require('dotenv');
dotenv.load();

var GOOGLE_KEY = process.env.GOOGLE_KEY;

// var MongoClient = require('mongodb').MongoClient;

var json_foodtrucks;
// var url = 'mongodb://localhost/boozeybites';
// MongoClient.connect(url, function(err, db) {
//
//   FoodTruck.find(function(err, foodtrucks) {
//     json_foodtrucks = foodtrucks;
//
//   });
// });


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
    res.render('boozeybites', { GOOGLE_KEY: GOOGLE_KEY });

  });

  // Nerd.find(function(err, nerds) {
  //
  //               // if there is an error retrieving, send the error.
  //                               // nothing after res.send(err) will execute
  //               if (err)
  //                   res.send(err);
  //
  //               res.json(nerds); // return all nerds in JSON format
  //           });




  // res.render('index', { title: 'Express' });

  // render data layers
});

module.exports = router;
