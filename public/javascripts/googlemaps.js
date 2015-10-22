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

function convertToAmPm(time) {
  var hour = time.split(":")[0]; // 12:00 => 12
  var min = time.split(":")[1]; // 12:00 => 00
  var ampm;
  if (hour === 0) {
    hour = 12; // 0:00 => 12:00
    ampm = "am";
  }
  if (hour > 12) {
    hour -= 12; // 13:00 => 1:00
    ampm = "pm";
  } else {
    ampm = "am";
  }
  var converted_time = hour + ":" + min + ampm;
  return converted_time;
}

function getFoodtrucks(map, infowindow) {
  $.ajax({
    type: "GET",
    url: '/api/foodtrucks',
    dataType: "json",
    success: function (res) {
      pinFoodtrucks(res, map, infowindow);
    }
  });
}

function pinFoodtrucks(foodtrucks, map, infowindow) {
  var weekday = determineWeekday();

  for (i = 0; i < foodtrucks.length; i++) {
    var lng = foodtrucks[i].schedule["" + weekday + ""][0].geometry.coordinates[0];
    var lat = foodtrucks[i].schedule["" + weekday + ""][0].geometry.coordinates[1];
    // var latLng = new google.maps.LatLng(foodtrucks[i].schedule["" + weekday + ""][0].geometry.coordinates[1], foodtrucks[i].schedule["" + weekday + ""][0].geometry.coordinates[0]);
    var latLng = new google.maps.LatLng(lat, lng);
    var name = foodtrucks[i].name;
    var cuisine = foodtrucks[i].cuisine;
    var payment = foodtrucks[i].payment.toLowerCase();
    var description = foodtrucks[i].description;
    var open = foodtrucks[i].schedule["" + weekday + ""][0].open;
    if (open !== undefined) {
      open = convertToAmPm(open);
    }
    var close = foodtrucks[i].schedule["" + weekday + ""][0].close;
    if (close !== undefined) {
      close = convertToAmPm(close);
    }
    var address = foodtrucks[i].schedule["" + weekday + ""][0].address;
    
    var content = "<div class='infowindow'><p>Name: " + name + "</p><p>Cuisine: " + cuisine + "</p><p>Accepted payment: " + payment + "</p><p>" + description + "</p><p>Open: " + open + "</p><p>Close: " + close + "</p><p>Address (approximate): " + address + "</p></div>";

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      label: "F",
      content: content
    });

    marker.addListener('click', function(e) {
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

  var infowindow = new google.maps.InfoWindow({});

  getFoodtrucks(map, infowindow);
  // getBreweries();
  // getDistilleries();
}
