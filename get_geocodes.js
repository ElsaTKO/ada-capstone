var express = require('express');
var fs      = require('fs');
var request = require('request');
var GOO_KEY = env('.env');
var app     = express();

// https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY

// http://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=GOO_KEY
