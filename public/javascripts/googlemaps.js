var introbox = $("#introbox");
introbox.on('click', function(e) {
    // e.preventDefault();
    introbox.hide();
});

function determineWeekday() {
  var today = new Date();
  var weekday_integer = today.getDay(); // 0 for Sunday, 1 for Monday, etc
  var hour = today.getHours(); // 0 for midnight, 23:59 for 11:59pm

  // is it late night? food trucks might still be out from previous day
  if (hour >= 0 && hour < 4) {
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
  hour = parseInt(hour);

  var ampm;
  if (hour === 0) {
    hour = 12; // 0:00 => 12:00
    ampm = "am";
  } else if (hour === 12) {
    ampm = "pm";
  } else if (hour > 12) {
    hour -= 12; // 13:00 => 1:00
    ampm = "pm";
  } else {
    ampm = "am";
  }

  var converted_time = hour + ":" + min + ampm;
  return converted_time;
}

function foodtruckIsClosedHuh(open_time, close_time) {
  // var open_time = foodtruck.schedule[weekday][0].open; // "9:00"
  var open_hour = parseInt(open_time.split(":")[0]); // 9
  var open_min = parseInt(open_time.split(":")[1]); // 0

  // var close_time = foodtruck.schedule[weekday][0].close; // "17:30"
  var close_hour = parseInt(close_time.split(":")[0]); // 17
  var close_min = parseInt(close_time.split(":")[1]); // 30

  var now = new Date();
  var now_hour = now.getHours();

  var open = new Date().setHours(open_hour, open_min);
  var close = new Date().setHours(close_hour, close_min);

  // earliest any food truck opens is 6am.
  // latest any food truck closes is 4am.
  // for all food trucks that close after midnight,
  // weekday is set back one day.
  // must calculate current, open, and close times
  // based on that adjustment.
  // now could be 4:00-23:59, 0:00-3:59
  // open could be 4:00-23:59 // assumes no food truck opens after midnight
  // close could be 4:00-23:59, 0:00-3:59
  if (now_hour >= 4 && open_hour >= 4 && close_hour >= 4) {
    // if
      // now 4:00-23:59
      // &&
      // open 4:00-23:59
      // &&
      // close 4:00-23:59
    // now => today => 0
    // open => today => 0
    // close => today => 0

    // all good, do nothing

  } else if (now_hour < 4 && open_hour >= 4 && close_hour >= 4) {
    // if
      // now 0:00-3:59
      // &&
      // open 4:00-23:59
      // &&
      // close 4:00-23:59
    // now => today => 0
    // open => yesterday => -1
    // close => yesterday => -1
    open = new Date(open).setDate(now.getDate() -1);
    close = new Date(close).setDate(now.getDate() -1);

  } else if (now_hour >= 4 && open_hour >= 4 && close_hour < 4) {
    // if
      // now 4:00-23:59
      // &&
      // open 4:00-23:59
      // &&
      // close 0:00-3:59
    // now => today => 0
    // open => today => 0
    // close => tomorrow => +1
    close = new Date(close).setDate(now.getDate() +1);

  } else if (now_hour < 4 && open_hour >= 4 && close_hour < 4) {
    // if
      // now 0:00-3:59
      // &&
      // open 4:00-23:59
      // &&
      // close 0:00-3:59
    // now => today => 0
    // open => yesterday => -1
    // close => today => 0
    open = new Date(open).setDate(now.getDate() -1);

  } else {
    console.error("A food truck opening time may be after midnight. Or something went wrong.");
  }

  if (now >= open && now < close) {
    return false; // open now
  } else {
    return true; // closed now
  }
}

function generateDirectionsUrl(lat, lng) {
  // example
  // https://www.google.com/maps/dir/Current+Location/47.12345,-122.12345
  var directions = "https://www.google.com/maps/dir/Current+Location/" + lat + "," + lng;
  return directions;
}

function setFoodtruckContent(foodtruck, weekday, lat, lng) {
  // create div and table
  var contentDiv = $("<div></div>");
  var table = $("<table></table>").addClass("infotable");

  // add name
  var name = $("<h2></h2>").text(foodtruck.name);
  var name_row = $("<tr></tr>").addClass("name-row");
  var name_cell = $("<td></td>").addClass("name").attr("colspan", "3");
  name_cell.append(name);
  name_row.append(name_cell);
  table.append(name_row);

  // add cuisine
  var cuisine = foodtruck.cuisine;
  var cuisine_row = $("<tr></tr>").addClass("cuisine-row");
  var cuisine_header = $("<td></td>").addClass("header").text("Cuisine:");
  var cuisine_cell = $("<td></td>").addClass("cuisine").attr("colspan", "2").text(cuisine);
  cuisine_row.append(cuisine_header, cuisine_cell);
  table.append(cuisine_row);

  if (foodtruck.payment !== undefined) {
    var payment = foodtruck.payment;
    var payment_row = $("<tr></tr>").addClass("payment-row");
    var payment_header = $("<td></td>").addClass("header").text("Accepted payment:");
    var payment_cell = $("<td></td>").addClass("payment").attr("colspan", "2").text(payment.toLowerCase());
    payment_row.append(payment_header, payment_cell);
    table.append(payment_row);
  }

  // add description
  var description = foodtruck.description;
  var description_row = $("<tr></tr>").addClass("description-row");
  var description_cell = $("<td></td>").addClass("description").attr("colspan", "3").text(description);
  description_row.append(description_cell);
  table.append(description_row);

  // add hours
  if (foodtruck.schedule[weekday][0].open !== undefined) { // at least has open time
    var hours_row = $("<tr></tr>").addClass("hours-row");
    var hours_header = $("<td></td>").addClass("header").text("Hours:");
    var open = foodtruck.schedule[weekday][0].open;
    var open_ampm = convertToAmPm(open);
    var close, hours_cell, close_ampm;
    if (foodtruck.schedule[weekday][0].close !== undefined) {
      close = foodtruck.schedule[weekday][0].close;
      close_ampm = convertToAmPm(close);
    }
    if (close !== undefined) { // both times given
      hours_cell = $("<td></td>").addClass("hours").text(open_ampm + " - " + close_ampm);
    } else if (open !== undefined && close === undefined) { // missing close
      hours_cell = $("<td></td>").addClass("hours").text(open_ampm + " - ?");
    }
    var warning = $("<i></i>").addClass("fa fa-exclamation-triangle");
    var hours_warning = $("<td></td>").addClass("hours-warning");
    hours_warning.append(warning, " confirm schedule");
    hours_row.append(hours_header, hours_cell, hours_warning);
    table.append(hours_row);
  }

  // add social
  if (foodtruck.contact.facebook !== undefined || foodtruck.contact.twitter_link !== undefined || foodtruck.contact.website !== undefined) {
    var social_row = $("<tr></tr>").addClass("social-row");
    var social_cell = $("<td></td>").addClass("social").attr("colspan", "3");

    if (foodtruck.contact.website !== undefined && foodtruck.contact.website !== "") { // have website
      var website_url = foodtruck.contact.website;
      var home = $("<i></i>").addClass("fa fa-home");
      var website_link = $("<a></a>").attr({target: "_blank", href: website_url}).html(home);
      social_cell.append(website_link);
    }

    if (foodtruck.contact.twitter_link !== undefined && foodtruck.contact.twitter_link !== "") { // have twitter
      var twitter_url = foodtruck.contact.twitter_link;
      var bird = $("<i></i>").addClass("fa fa-twitter");
      var twitter_link = $("<a></a>").attr({target: "_blank", href: twitter_url}).html(bird);
      social_cell.append(twitter_link);
    }

    if (foodtruck.contact.facebook !== undefined && foodtruck.contact.facebook !== "") { // have facebook
      var facebook_url = foodtruck.contact.facebook;
      var eff = $("<i></i>").addClass("fa fa-facebook");
      var facebook_link = $("<a></a>").attr({target: "_blank", href: facebook_url}).html(eff);
      social_cell.append(facebook_link);
    }
    social_row.append(social_cell);
    table.append(social_row);
  }

  // add address
  var address = foodtruck.schedule[weekday][0].address;
  var address_row = $("<tr></tr>").addClass("address-row");
  var address_header = $("<td></td>").addClass("header").text("Address (approximate):");
  var address_cell = $("<td></td>").addClass("address").attr("colspan", "2").text(address);
  address_row.append(address_header, address_cell);
  table.append(address_row);

  // add directions
  var directions_url = generateDirectionsUrl(lat, lng);
  var directions_link = $("<a target='_blank' href='" + directions_url + "'>Directions</a>");
  var directions_row = $("<tr></tr>").addClass("directions-row");
  var directions_cell = $("<td></td>").addClass("directions").attr("colspan", "3");
  directions_cell.append(directions_link);
  directions_row.append(directions_cell);
  table.append(directions_row);

  // append table to div
  contentDiv.append(table);
  // console.log(contentDiv[0].innerHTML);
  return contentDiv[0].innerHTML;
}

function setEstablishmentContent(establishment, lat, lng) {
  // create div and table
  var contentDiv = $("<div></div>");
  var table = $("<table></table>").addClass("infotable");

  // add name
  var name = $("<h2></h2>").text(establishment.name);
  var name_row = $("<tr></tr>").addClass("name-row");
  var name_cell = $("<td></td>").addClass("name").attr("colspan", "3");
  name_cell.append(name);
  name_row.append(name_cell);
  table.append(name_row);

  if (establishment.contact.facebook !== undefined || establishment.contact.twitter_link !== undefined || establishment.contact.website !== undefined) {
    var social_row = $("<tr></tr>").addClass("social-row");
    var social_cell = $("<td></td>").addClass("social").attr("colspan", "3");

    if (establishment.contact.website !== undefined && establishment.contact.website !== "") { // have website
      var website_url = establishment.contact.website;
      var home = $("<i></i>").addClass("fa fa-home");
      var website_link = $("<a></a>").attr({target: "_blank", href: website_url}).html(home);
      social_cell.append(website_link);
    }

    if (establishment.contact.twitter_link !== undefined && establishment.contact.twitter_link !== "") { // have twitter
      var twitter_url = establishment.contact.twitter_link;
      var bird = $("<i></i>").addClass("fa fa-twitter");
      var twitter_link = $("<a></a>").attr({target: "_blank", href: twitter_url}).html(bird);
      social_cell.append(twitter_link);
    }

    if (establishment.contact.facebook !== undefined && establishment.contact.facebook !== "") { // have facebook
      var facebook_url = establishment.contact.facebook;
      var eff = $("<i></i>").addClass("fa fa-facebook");
      var facebook_link = $("<a></a>").attr({target: "_blank", href: facebook_url}).html(eff);
      social_cell.append(facebook_link);
    }
    social_row.append(social_cell);
    table.append(social_row);
  }

  // add address
  var address = establishment.address;
  var address_row = $("<tr></tr>").addClass("address-row");
  var address_header = $("<td></td>").addClass("header").text("Address:");
  var address_cell = $("<td></td>").addClass("address").attr("colspan", "2").text(address);
  address_row.append(address_header, address_cell);
  table.append(address_row);

  // add directions
  var directions_url = generateDirectionsUrl(lat, lng);
  var directions_link = $("<a target='_blank' href='" + directions_url + "'>Directions</a>");
  var directions_row = $("<tr></tr>").addClass("directions-row");
  var directions_cell = $("<td></td>").addClass("directions").attr("colspan", "3");
  directions_cell.append(directions_link);
  directions_row.append(directions_cell);
  table.append(directions_row);

  // append table to div
  contentDiv.append(table);
  // console.log(contentDiv[0].innerHTML);
  return contentDiv[0].innerHTML;
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
    var foodtruck = foodtrucks[i];
    var lng = foodtruck.schedule[weekday][0].geometry.coordinates[0];
    var lat = foodtruck.schedule[weekday][0].geometry.coordinates[1];
    var latLng = new google.maps.LatLng(lat, lng);
    var open = foodtruck.schedule[weekday][0].open;
    var open_ampm, close_ampm;
    var close = foodtruck.schedule[weekday][0].close;
    var content = setFoodtruckContent(foodtruck, weekday, lat, lng);

    var image;
    if (open !== undefined && close !== undefined) {
      var is_closed = foodtruckIsClosedHuh(open, close);
      if (is_closed === true) {
        image = 'images/foodtruck_closed.png';
      } else {
        image = 'images/foodtruck.png';
      }
    } else {
      image = 'images/foodtruck.png';
    }

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: image,
      content: content
    });

    marker.addListener('click', function(e) {
      infowindow.setContent(this.content);
      infowindow.open(map, this);
    });
  }
}

function getBreweries(map, infowindow) {
  $.ajax({
    type: "GET",
    url: '/api/breweries',
    dataType: "json",
    success: function (res) {
      pinBreweries(res, map, infowindow);
    }
  });
}

function pinBreweries(breweries, map, infowindow) {
  // var weekday = determineWeekday();

  for (i = 0; i < breweries.length; i++) {
    var brewery = breweries[i];
    var lng = brewery.geometry.coordinates[0];
    var lat = brewery.geometry.coordinates[1];
    var latLng = new google.maps.LatLng(lat, lng);

    // var name = brewery.name;
    // var address = brewery.address;
    // var directions_url = generateDirectionsUrl(lat, lng);
    // var directions_link = "<a href='" + directions_url + "' target='_blank'>Directions</a>";
    // var facebook_url = brewery.contact.facebook;
    // var facebook_link = "<a href='" + facebook_url + "' target='_blank'>Facebook</a>";
    // var twitter_url = brewery.contact.twitter_link;
    // var twitter_link = "<a href='" + twitter_url + "' target='_blank'>Twitter</a>";
    // var website_url = brewery.contact.website;
    // var website_link = "<a href='" + website_url + "' target='_blank'>website</a>";

    // var content = "<div class='infowindow'><p>" + name + "</p><p>Address: " + address + "</p><p>" + directions_link + "</p></div>";
    var content = setEstablishmentContent(brewery, lat, lng);

    var image = 'images/brewery.png';

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: image,
      content: content
    });

    marker.addListener('click', function(e) {
      infowindow.setContent(this.content);
      infowindow.open(map, this);
    });
  }
}

function getDistilleries(map, infowindow) {
  $.ajax({
    type: "GET",
    url: '/api/distilleries',
    dataType: "json",
    success: function (res) {
      pinDistilleries(res, map, infowindow);
    }
  });
}

function pinDistilleries(distilleries, map, infowindow) {
  // var weekday = determineWeekday();

  for (i = 0; i < distilleries.length; i++) {
    var distillery = distilleries[i];
    var lng = distillery.geometry.coordinates[0];
    var lat = distillery.geometry.coordinates[1];
    var latLng = new google.maps.LatLng(lat, lng);

    // var name = distillery.name;
    // var address = distillery.address;
    // var directions_url = generateDirectionsUrl(lat, lng);
    // var directions_link = "<a href='" + directions_url + "' target='_blank'>Directions</a>";
    // // var facebook_url = distillery.contact.facebook;
    // // var facebook_link = "<a href='" + facebook_url + "' target='_blank'>Facebook</a>";
    // var twitter_url = distillery.contact.twitter_link;
    // var twitter_link = "<a href='" + twitter_url + "' target='_blank'>Twitter</a>";
    // var website_url = distillery.contact.website;
    // var website_link = "<a href='" + website_url + "' target='_blank'>website</a>";

    // var content = "<div class='infowindow'><p>" + name + "</p><p>Address: " + address + "</p><p>" + directions_link + "</p></div>";
    var content = setEstablishmentContent(distillery, lat, lng);

    var image = 'images/distillery.png';

    var marker = new google.maps.Marker({
      position: latLng,
      map: map,
      icon: image,
      content: content
    });

    marker.addListener('click', function(e) {
      infowindow.setContent(this.content);
      infowindow.open(map, this);
    });
  }
}

function initMap() {
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 47.6097, lng: -122.3331}
  });

  var infowindow = new google.maps.InfoWindow({});

  getFoodtrucks(map, infowindow);
  getBreweries(map, infowindow);
  getDistilleries(map, infowindow);
}
