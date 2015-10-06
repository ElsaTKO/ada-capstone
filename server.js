// // Retrieve
// var MongoClient = require('mongodb').MongoClient;
//
// // Connection
// var url = 'mongodb://localhost:3001/cap-dev';
//
// // Connect
// MongoClient.connect(url, function (err, db) {
//   if (err) {
//     console.log('Unable to connect to the mongoDB server. Error:', err);
//   } else {
//     // connected
//     console.log('Connection established to', url);
//
//     // do some work here with the database.
//
//     // close connection
//     db.close();
//   }
// });

var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');

var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});
