var express = require('express');
var router = express.Router();
var app = express();
var GOOGLE_KEY;
if (app.get('env') === 'development') {
  var dotenv  = require('dotenv');
  dotenv.load();
  GOOGLE_KEY = process.env.GOOGLE_DEV_KEY;
} else {
  GOOGLE_KEY = process.env.GOOGLE_PROD_KEY;
}




/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { GOOGLE_KEY: GOOGLE_KEY });

});

module.exports = router;
