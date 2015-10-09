# Product Plan
## Problem Statement
To quickly find food trucks near breweries and distilleries in Seattle.

Currently there is no way to directly compare locations of food trucks and craft beer/spirits establishments in Seattle. Some establishments schedule food trucks, but some may just happen to be in the neighborhood. Deciding where to drink and eat is time-consuming (especially in a group) due to switching between maps schedules, and tweets.

My web app will map both breweries, distilleries, _and_ food trucks. It will include the live Twitter feed for food trucks as a means to check if it has deviated from the schedule.

## Market Research
### Competition
Currently there are only independent maps for Seattle breweries, distilleries, and food trucks. The only map that can select down exclusively to breweries (as opposed to brewpubs with their own kitchens) is [The Beer Mapping Project](http://beermapping.com/maps/citymaps.php?m=seattle#lat=undefined&lng=undefined&z=7). The only distillery map is [Washington Distilleries](http://www.washingtondistilleries.com/seattle), and the only food truck map is [Roaming Hunger](http://roaminghunger.com/sea/). Food truck schedules and live tweets can be found at [Seattle Food Truck](http://www.seattlefoodtruck.com/), but there is no corresponding map, only neighborhood listings.

### User Research
While it's easy to locate food trucks by name or cuisine, it's not necessarily helpful if you already plan on being in a different neighborhood. Even locating trucks by neighborhood can be a pain if the truck is too far away (however that's defined at the time). There's no way to quickly see what food trucks are near breweries/distilleries or vice versa.

### Differentiation
My application puts all the location and business hour information for food trucks, breweries, and distilleries in one place to make decision-making faster and easier.

## User Personas
The main user groups include those who reflect statements like:

- "I want to see which areas have concentrations of craft food and drink options so that I can pick a neighborhood to explore."

- "I want to see the closest food trucks to a brewery and when they're open so that I can plan when to go there."

## Specification
My application will map breweries, distilleries, and food trucks on a single page for easy viewing and exploring. Specific information such as business hours, descriptions, and navigation directions will be available for each point. Users want to make decisions when they are on the go, which lends itself to mobile-first design. Since food trucks may deviate from their usual schedules for special events, access to the latest food truck tweets will be provided as a means to double-check.

For my own learning goals, I will implement the application using MongoDB, Node.js, Google Maps JavaScript API, and Twitter API.

## Timeline
### [Trello board](https://trello.com/b/0NSFiRav/elsa-capstone)
### Friday Oct 9
Have app set up with Mongo and Node. Build a scraper to collect food truck data.

### Friday Oct 16
Have API keys for Twitter and The Beer Mapping Project. Have brewery, distillery, and food truck data in database.

### Friday Oct 23
Represent GeoJSON data on map through Google Maps API. Populate pop-up windows with data, including tweets and directions.

### Friday Oct 30
Bug fixes, scope creep, and deploy to EC2.
