var fs = require('fs');
var xml2js = require('xml2js');

var parser = new xml2js.Parser();

var all_beer;
var breweries = [];

fs.readFile('./breweries_from_api_chars.xml', function(err, data) {
  if (err) {
    console.log(err);
  } else {
    parser.parseString(data, function (err, result) {
      if (err) {
        console.log(err);
      } else {
        all_beer = (result.bmp_locations.location);

        // create address key
        all_beer["address"] = undefined;

        for (i = 0; i < all_beer.length; i++) {
          // strip arrays wrapping each value
          all_beer[i].name = all_beer[i].name[0];
          all_beer[i].status = all_beer[i].status[0];
          all_beer[i].street = all_beer[i].street[0];
          all_beer[i].city = all_beer[i].city[0];
          all_beer[i].state = all_beer[i].state[0];
          all_beer[i].zip = all_beer[i].zip[0];

          // remove unwanted keys
          delete all_beer[i].id;
          delete all_beer[i].reviewlink;
          delete all_beer[i].proxylink;
          delete all_beer[i].blogmap;
          delete all_beer[i].country;
          delete all_beer[i].phone;
          delete all_beer[i].overall;
          delete all_beer[i].imagecount;

          // remove non-breweries
          if (all_beer[i].status === "Brewery") {
            delete all_beer[i].status;

            // compile address
            all_beer[i].address = all_beer[i].street + ", " + all_beer[i].city + ", " + all_beer[i].state + " " + all_beer[i].zip;

            breweries.push(all_beer[i]);
          }
        }

        console.log(breweries.length);
        console.log(breweries[0]);

        fs.writeFile('breweries_and_loc.json', JSON.stringify(breweries, null, 2), function(err) {
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
