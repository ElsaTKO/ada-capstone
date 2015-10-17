var fs = require('fs');
var xml2js = require('xml2js');
var sleep = require('sleep');

var parser = new xml2js.Parser();

fs.readFile('./breweries_from_api_chars.xml', function(err, data) {
  if (err) {
    console.log(err);
  } else {
    parser.parseString(data, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        // console.dir(result);
        fs.writeFile('all_beer.json', JSON.stringify(result, null, 2), function(err) {
          if (err) {
            console.log(err);
          } else {
            console.log("File written!");
          }
        });
        console.log('Done.');
      }
    });
  }
});
