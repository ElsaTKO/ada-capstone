function determineWeekday() {
  var today = new Date();
  var weekday_integer = today.getDay(); // 0 for Sunday, 1 for Monday, etc
  var hour = today.getHours(); // 0 for midnight, 23:59 for 11:59pm

  // is it late night? food trucks might still be out from previous day
  if (hour >= 0 && hour <= 4) {
    // is it sunday? rewinding one day needs to be 6, not -1
    if (weekday_integer === 0) {
      weekday_integer = 6;
    } else {
      weekday_integer -= 1;
    }
  }

  var weekdayMap = {
    0: "sunday",
    1: "monday",
    2: "tuesday",
    3: "wednesday",
    4: "thursday",
    5: "friday",
    6: "saturday"
  };
  var weekday = weekdayMap[weekday_integer];
  return weekday;
}

function getFoodtrucks(map) {
  $.ajax({
    type: "GET",
    url: '/api/foodtrucks',
    dataType: "json",
    success: function (res) {
      pinFoodtrucks(res, map);
    }
  });
}

function pinFoodtrucks(foodtrucks, map) {
  var weekday = determineWeekday();

  var infowindow = new google.maps.InfoWindow({});

  for (i = 0; i < foodtrucks.length; i++) {
    var latLng = new google.maps.LatLng(foodtrucks[i].schedule["" + weekday + ""][0].geometry.coordinates[1], foodtrucks[i].schedule["" + weekday + ""][0].geometry.coordinates[0]);

    var content = foodtrucks[i].name;

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      label: "F",
      content: content
    });

    marker.addListener('click', function(e) {
      infowindow.close();
      // var content = foodtrucks[i].name;
      infowindow.setContent(this.content);
      infowindow.open(map, this);
    });
  }
}

// function getBreweries() {
//
// }
//
// function getDistilleries() {
//
// }

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 47.6097, lng: -122.3331}
  });

  getFoodtrucks(map);
  // getBreweries();
  // getDistilleries();
}
