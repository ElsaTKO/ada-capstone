var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var sleep 	= require('sleep');
var app     = express();

app.get('/scrape', function(req, res){
	url = 'http://www.seattlefoodtruck.com/index.php/trucks/314-pie/';

	request(url, function(error, response, html) {
		if (!error) {
			var $ = cheerio.load(html);

			sleep.sleep(1);

			var name, cuisine, payment, description, facebook, twitter, website;
			var stuff;
			var json = {
				name: "",
				cuisine: "",
				payment: "",
				description: "",
				schedule:
					{
						monday: {
							address: "",
							coordinates: [
								null,
								null
							],
							open: "",
							close: ""
						},
						tuesday: {
							address: "",
							coordinates: [
								null,
								null
							],
							open: "",
							close: ""
						},
						other: ""
					},
				contact:
					{
						facebook: "",
						twitter: "",
						twitter_handle: "",
						website: ""
					}

			};

			name = $(".entry-title").text();
      json.name = name;

			var cell_pairs = [];
			var cells = $(".entry-content td");
			console.log("CELLS COUNT: ", cells.length); // 3
			cells.each(function(index, value) {
				console.log("CELL[" + index + "]: ", $(this).text());
				var orig_text = $(this).text();
				var no_newline_text = orig_text.replace(/(\r\n|\n|\r)/gm,"").trim();
				cell_pairs[index] = no_newline_text;
			});
			console.log(cell_pairs);
			
			var cuisine_index = cell_pairs.indexOf("Food Type:") + 1;
			json.cuisine = cell_pairs[cuisine_index];

			var payment_index = cell_pairs.indexOf("Payment:") + 1;
			json.payment = cell_pairs[payment_index];

			var description_index = cell_pairs.indexOf("Description:") + 1;
			json.description = cell_pairs[description_index];

			var facebook_index = cell_pairs.indexOf("Facebook:") + 1;
			json.contact.facebook = cell_pairs[facebook_index];

			var twitter_index = cell_pairs.indexOf("Twitter:") + 1;
			json.contact.twitter 	= cell_pairs[twitter_index];

			var website_index = cell_pairs.indexOf("Website:") + 1;
			json.contact.website 	= cell_pairs[website_index];

      console.log(json);
			// console.log("json.name: ", json.name);
			// console.log("rows: \n", rows);


			// links.each(function() {
		  //       // var links = $(this);
      //       var href = this.href;
		  //       // title = links.children().first().text();
		  //       // release = links.children().last().children().text();
      //
		  //       // json.title = title;
		  //       // json.release = release;
      //       truck_links.push(this.href);
      //
	    //     });

	        // $('.star-box-giga-star').filter(function(){
	        // 	var links = $(this);
	        // 	rating = links.text();
          //
	        // 	json.rating = rating;
	        // });
		}

	// 	fs.writeFile('food_trucks_data.json', JSON.stringify(json, null, 4), function(err){
  //     if (err) {
  //       console.log("Write file error: ", err);
  //     }
  //       	console.log('Success!');
  //       });
  //
  //       res.send('Success!');
	});



});

app.listen('8181');
console.log('Scraper port open');
exports = module.exports = app;




var truck_links = [ 'http://www.seattlefoodtruck.com/index.php/trucks/314-pie/',
  'http://www.seattlefoodtruck.com/index.php/trucks/a-fire-inside-wood-fired-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/absolut-hot-dog-and-gyros/',
  'http://www.seattlefoodtruck.com/index.php/trucks/arnolds-happy-days-food-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/athenas/',
  'http://www.seattlefoodtruck.com/index.php/auto-pompa-pizzeria/',
  'http://www.seattlefoodtruck.com/index.php/trucks/bake-my-day',
  'http://www.seattlefoodtruck.com/index.php/trucks/balleywood-creamery',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-barking-frog/',
  'http://www.seattlefoodtruck.com/index.php/trucks/barriga-llena/',
  'http://www.seattlefoodtruck.com/index.php/trucks/beanfish/',
  'http://www.seattlefoodtruck.com/index.php/trucks/beezneez-gourmet-sausages',
  'http://www.seattlefoodtruck.com/index.php/trucks/beloved-mexico/',
  'http://www.seattlefoodtruck.com/index.php/trucks/ben-jerrys/',
  'http://www.seattlefoodtruck.com/index.php/trucks/big-boys-filipino-food-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/big-dogs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/big-eds-good-eats/',
  'http://www.seattlefoodtruck.com/index.php/trucks/big-house-bbq/',
  'http://www.seattlefoodtruck.com/index.php/trucks/big-spoon/',
  'http://www.seattlefoodtruck.com/index.php/trucks/biscuit-box',
  'http://www.seattlefoodtruck.com/index.php/trucks/bite-me-cupcakes/',
  'http://www.seattlefoodtruck.com/index.php/trucks/bomba-fusion/',
  'http://www.seattlefoodtruck.com/index.php/trucks/brazil-on-the-road/',
  'http://www.seattlefoodtruck.com/index.php/trucks/bread-and-butter/',
  'http://www.seattlefoodtruck.com/index.php/trucks/bread-and-circuses/',
  'http://www.seattlefoodtruck.com/index.php/trucks/buddha-bruddah',
  'http://www.seattlefoodtruck.com/index.php/trucks/budha-bear-bagels/',
  'http://www.seattlefoodtruck.com/index.php/trucks/bumbu-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/buns/',
  'http://www.seattlefoodtruck.com/index.php/trucks/cake-mobile/',
  'http://www.seattlefoodtruck.com/index.php/trucks/campfire-chuck-wagon/',
  'http://www.seattlefoodtruck.com/index.php/trucks/caravan-crepes/',
  'http://www.seattlefoodtruck.com/index.php/trucks/carmelitos/',
  'http://www.seattlefoodtruck.com/index.php/trucks/charlies/',
  'http://www.seattlefoodtruck.com/index.php/trucks/cheese-wizards/',
  'http://www.seattlefoodtruck.com/index.php/trucks/chewaya-authen…can-sandwiches/',
  'http://www.seattlefoodtruck.com/index.php/trucks/chickn-fix/',
  'http://www.seattlefoodtruck.com/index.php/trucks/chopstix/',
  'http://www.seattlefoodtruck.com/index.php/trucks/contigo/',
  'http://www.seattlefoodtruck.com/index.php/trucks/convoy-coffee',
  'http://www.seattlefoodtruck.com/index.php/trucks/crisp-creperie/',
  'http://www.seattlefoodtruck.com/index.php/trucks/curb-jumper-street-eats/',
  'http://www.seattlefoodtruck.com/index.php/trucks/curbside/',
  'http://www.seattlefoodtruck.com/index.php/trucks/curbside-urban-cuisine/',
  'http://www.seattlefoodtruck.com/index.php/trucks/danielles-crepes/',
  'http://www.seattlefoodtruck.com/index.php/trucks/dantes-inferno-dogs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/das-brat-wagen/',
  'http://www.seattlefoodtruck.com/index.php/trucks/delfinos-chicago-style-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/delicatessen-montanti/',
  'http://www.seattlefoodtruck.com/index.php/trucks/diablo-food-truckz/',
  'http://www.seattlefoodtruck.com/index.php/trucks/dirty-dog/',
  'http://www.seattlefoodtruck.com/index.php/trucks/djung-on-wheels/',
  'http://www.seattlefoodtruck.com/index.php/trucks/dog-japon/',
  'http://www.seattlefoodtruck.com/index.php/trucks/dogfather-catering/',
  'http://www.seattlefoodtruck.com/index.php/trucks/don-luchos/',
  'http://www.seattlefoodtruck.com/index.php/trucks/el-cabrito/',
  'http://www.seattlefoodtruck.com/index.php/trucks/el-camion/',
  'http://www.seattlefoodtruck.com/index.php/trucks/el-sabroso-de-seattle/',
  'http://www.seattlefoodtruck.com/index.php/trucks/ezells-express/',
  'http://www.seattlefoodtruck.com/index.php/trucks/falafel-salam/',
  'http://www.seattlefoodtruck.com/index.php/trucks/fez/',
  'http://www.seattlefoodtruck.com/index.php/trucks/flair-taco/',
  'http://www.seattlefoodtruck.com/index.php/trucks/franks-franks',
  'http://www.seattlefoodtruck.com/index.php/trucks/fruit-chatter-box/',
  'http://www.seattlefoodtruck.com/index.php/trucks/full-tilt-ice-cream',
  'http://www.seattlefoodtruck.com/index.php/trucks/gai-box/',
  'http://www.seattlefoodtruck.com/index.php/trucks/galaxy-donuts/',
  'http://www.seattlefoodtruck.com/index.php/trucks/garden-sushi/',
  'http://www.seattlefoodtruck.com/index.php/trucks/gibsons-frozen-yogurt-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/gobble-express/',
  'http://www.seattlefoodtruck.com/index.php/trucks/goreeng/',
  'http://www.seattlefoodtruck.com/index.php/trucks/grilled-cheese-experience/',
  'http://www.seattlefoodtruck.com/index.php/trucks/hallava-falafel/',
  'http://www.seattlefoodtruck.com/index.php/trucks/hamhock-jones-soul-shack/',
  'http://www.seattlefoodtruck.com/index.php/trucks/happy-grillmore/',
  'http://www.seattlefoodtruck.com/index.php/trucks/here-and-there-grill/',
  'http://www.seattlefoodtruck.com/index.php/trucks/hot-diggity-dogs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/hot-dog-king/',
  'http://www.seattlefoodtruck.com/index.php/trucks/hot-dog-stop/',
  'http://www.seattlefoodtruck.com/index.php/trucks/hot-revolution-donuts',
  'http://www.seattlefoodtruck.com/index.php/trucks/hps-smokehouse-bbq/',
  'http://www.seattlefoodtruck.com/index.php/trucks/hungry-me/',
  'http://www.seattlefoodtruck.com/index.php/trucks/i-love-my-gff/',
  'http://www.seattlefoodtruck.com/index.php/trucks/its-bao-time/',
  'http://www.seattlefoodtruck.com/index.php/trucks/jemils-big-easy/',
  'http://www.seattlefoodtruck.com/index.php/trucks/jjfroyogo/',
  'http://www.seattlefoodtruck.com/index.php/trucks/just-jacks/',
  'http://www.seattlefoodtruck.com/index.php/trucks/kaosamai-thai-cook-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/kc-deez-bbq/',
  'http://www.seattlefoodtruck.com/index.php/trucks/kerrys-caribbean-takeout/',
  'http://www.seattlefoodtruck.com/index.php/trucks/kiss-my-grits/',
  'http://www.seattlefoodtruck.com/index.php/trucks/kurbside-kitchen/',
  'http://www.seattlefoodtruck.com/index.php/trucks/lil-blu-and-half-pint/',
  'http://www.seattlefoodtruck.com/index.php/trucks/local-dogs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/localhash/',
  'http://www.seattlefoodtruck.com/index.php/trucks/los-chilangos/',
  'http://www.seattlefoodtruck.com/index.php/trucks/luchador-taco-co/',
  'http://www.seattlefoodtruck.com/index.php/trucks/lumpia-world/',
  'http://www.seattlefoodtruck.com/index.php/trucks/macho-burgers/',
  'http://www.seattlefoodtruck.com/index.php/trucks/made-in-taiwan-food-trailer/',
  'http://www.seattlefoodtruck.com/index.php/trucks/marination/',
  'http://www.seattlefoodtruck.com/index.php/trucks/maximusminimus/',
  'http://www.seattlefoodtruck.com/index.php/trucks/meat-on-a-mission',
  'http://www.seattlefoodtruck.com/index.php/trucks/mesob-at-the-curb/',
  'http://www.seattlefoodtruck.com/index.php/trucks/mighty-bean-espresso/',
  'http://www.seattlefoodtruck.com/index.php/trucks/milkmans-daughter/',
  'http://www.seattlefoodtruck.com/index.php/trucks/mini-the-dough-nut/',
  'http://www.seattlefoodtruck.com/index.php/trucks/mobile-mayan/',
  'http://www.seattlefoodtruck.com/index.php/trucks/mobile-smoke-rainin-ribs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/molly-moon/',
  'http://www.seattlefoodtruck.com/index.php/trucks/moonie-icy-tunes/',
  'http://www.seattlefoodtruck.com/index.php/trucks/moreno-mexican-food/',
  'http://www.seattlefoodtruck.com/index.php/trucks/motofish-coffee/',
  'http://www.seattlefoodtruck.com/index.php/trucks/mr-gyros/',
  'http://www.seattlefoodtruck.com/index.php/trucks/my-chef-lynn/',
  'http://www.seattlefoodtruck.com/index.php/trucks/my-sweet-lil-cakes/',
  'http://www.seattlefoodtruck.com/index.php/trucks/naansense',
  'http://www.seattlefoodtruck.com/index.php/trucks/napkin-friends/',
  'http://www.seattlefoodtruck.com/index.php/trucks/narwhal/',
  'http://www.seattlefoodtruck.com/index.php/trucks/neemas-comfort/',
  'http://www.seattlefoodtruck.com/index.php/trucks/nibbles/',
  'http://www.seattlefoodtruck.com/index.php/trucks/no-bones-about-it/',
  'http://www.seattlefoodtruck.com/index.php/trucks/nomad-curbside/',
  'http://www.seattlefoodtruck.com/index.php/trucks/nosh/',
  'http://www.seattlefoodtruck.com/index.php/trucks/now-make-me-a-sandwich/',
  'http://www.seattlefoodtruck.com/index.php/trucks/off-the-rez/',
  'http://www.seattlefoodtruck.com/index.php/trucks/outside-the-box/',
  'http://www.seattlefoodtruck.com/index.php/trucks/panhandle-barbecue/',
  'http://www.seattlefoodtruck.com/index.php/trucks/papa-bois/',
  'http://www.seattlefoodtruck.com/index.php/trucks/papas-place-food-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/papas-wood-fired-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/parfait/',
  'http://www.seattlefoodtruck.com/index.php/trucks/peasant-food-manifesto',
  'http://www.seattlefoodtruck.com/index.php/trucks/people-of-the-chubbs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/philly-boys-cheesesteaks/',
  'http://www.seattlefoodtruck.com/index.php/trucks/picnic/',
  'http://www.seattlefoodtruck.com/index.php/trucks/pie-mobile/',
  'http://www.seattlefoodtruck.com/index.php/trucks/pinkys-kitchen/',
  'http://www.seattlefoodtruck.com/index.php/trucks/pioneer-grill-hot-dogs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/pizza-lab/',
  'http://www.seattlefoodtruck.com/index.php/trucks/plum-vegan-burgers-more/',
  'http://www.seattlefoodtruck.com/index.php/trucks/poke-to-the-max/',
  'http://www.seattlefoodtruck.com/index.php/trucks/pompeii-woodfired-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/pop-up/',
  'http://www.seattlefoodtruck.com/index.php/trucks/quack-dogs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/que-tacos!/',
  'http://www.seattlefoodtruck.com/index.php/trucks/raclette-seattle/',
  'http://www.seattlefoodtruck.com/index.php/trucks/raney-brothers-bbq/',
  'http://www.seattlefoodtruck.com/index.php/trucks/richards-hot-dogs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/roll-ok-please',
  'http://www.seattlefoodtruck.com/index.php/trucks/rollin-chubbies/',
  'http://www.seattlefoodtruck.com/index.php/trucks/saffron-spice/',
  'http://www.seattlefoodtruck.com/index.php/trucks/savory-eats/',
  'http://www.seattlefoodtruck.com/index.php/trucks/seattle-biscuit-co/',
  'http://www.seattlefoodtruck.com/index.php/trucks/seattle-chicken-over-rice/',
  'http://www.seattlefoodtruck.com/index.php/trucks/cookie-counter/',
  'http://www.seattlefoodtruck.com/index.php/trucks/seattle-pops/',
  'http://www.seattlefoodtruck.com/index.php/trucks/seattle-wood-fired-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/secret-sausage/',
  'http://www.seattlefoodtruck.com/index.php/trucks/seoul-kitchen/',
  'http://www.seattlefoodtruck.com/index.php/trucks/sir-chef-pinoy-rice-bowl/',
  'http://www.seattlefoodtruck.com/index.php/trucks/six-coins-japanese-food-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/six-strawberries/',
  'http://www.seattlefoodtruck.com/index.php/trucks/sizzle-dogs/',
  'http://www.seattlefoodtruck.com/index.php/trucks/skillet/',
  'http://www.seattlefoodtruck.com/index.php/trucks/skooders-hot-dog-co/',
  'http://www.seattlefoodtruck.com/index.php/trucks/slate-coffee/',
  'http://www.seattlefoodtruck.com/index.php/trucks/smitspit/',
  'http://www.seattlefoodtruck.com/index.php/trucks/snout-co/',
  'http://www.seattlefoodtruck.com/index.php/trucks/soda-jerk/',
  'http://www.seattlefoodtruck.com/index.php/trucks/spice-on-curve/',
  'http://www.seattlefoodtruck.com/index.php/trucks/spicy-papaya/',
  'http://www.seattlefoodtruck.com/index.php/trucks/stacks/',
  'http://www.seattlefoodtruck.com/index.php/trucks/stella-rossa-wood-fired-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/street-donuts/',
  'http://www.seattlefoodtruck.com/index.php/trucks/street-treats/',
  'http://www.seattlefoodtruck.com/index.php/trucks/streetzeria/',
  'http://www.seattlefoodtruck.com/index.php/trucks/sugars-gelato/',
  'http://www.seattlefoodtruck.com/index.php/trucks/sweet-wheels/',
  'http://www.seattlefoodtruck.com/index.php/trucks/t-and-a-gourmet-steamed-cheeseburgers/',
  'http://www.seattlefoodtruck.com/index.php/trucks/tacos-el-tajin/',
  'http://www.seattlefoodtruck.com/index.php/trucks/taqueria-el-rincon',
  'http://www.seattlefoodtruck.com/index.php/trucks/taqueria-la-fondita-ii',
  'http://www.seattlefoodtruck.com/index.php/trucks/tasty-vibes/',
  'http://www.seattlefoodtruck.com/index.php/trucks/tats-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/tengo-hambre/',
  'http://www.seattlefoodtruck.com/index.php/trucks/thai-me-up/',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-box/',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-brick-wood-fired-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-crepe-man',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-frying-dutchman/',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-hot-potato/',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-mobile-lunch-box/',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-peach-and-the-pig/',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-peoples-burger/',
  'http://www.seattlefoodtruck.com/index.php/trucks/the-ultimate-melt/',
  'http://www.seattlefoodtruck.com/index.php/trucks/tokyo-dog/',
  'http://www.seattlefoodtruck.com/index.php/trucks/top-pot-mobile/',
  'http://www.seattlefoodtruck.com/index.php/trucks/tummy-yummy-thai/',
  'http://www.seattlefoodtruck.com/index.php/trucks/tuscan-stone-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/veraci-pizza/',
  'http://www.seattlefoodtruck.com/index.php/trucks/veritas-coffee-company/',
  'http://www.seattlefoodtruck.com/index.php/trucks/vietnom-nom/',
  'http://www.seattlefoodtruck.com/index.php/trucks/where-ya-at/',
  'http://www.seattlefoodtruck.com/index.php/trucks/wicked-pies/',
  'http://www.seattlefoodtruck.com/index.php/trucks/wiseguy-italian-street-food/',
  'http://www.seattlefoodtruck.com/index.php/trucks/woodshop-bbq/',
  'http://www.seattlefoodtruck.com/index.php/trucks/xplosive-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/yi-dim-sum/',
  'http://www.seattlefoodtruck.com/index.php/trucks/yumbit-food-truck/',
  'http://www.seattlefoodtruck.com/index.php/trucks/yummy-box/' ];
