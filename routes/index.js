var express = require('express');
var router = express.Router();
var app = express();
if (app.get('env') === 'development') {
  var dotenv  = require('dotenv');
  dotenv.load();
  var GOOGLE_KEY = process.env.GOOGLE_DEV_KEY;
} else {
  var GOOGLE_KEY = process.env.GOOGLE_PROD_KEY;
}




/* GET home page. */
router.get('/', function(req, res, next) {

    res.render('index', { GOOGLE_KEY: GOOGLE_KEY });

});

module.exports = router;
