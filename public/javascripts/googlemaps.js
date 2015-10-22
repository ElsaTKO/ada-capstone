function getFoodtrucks() {
  $.ajax({
    type: "GET",
    url: '/api/foodtrucks',
    dataType: "json",
    success: function (res) {
      pinFoodtrucks(res);
    }
  });
}

function pinFoodtrucks(foodtrucks) {
  console.log(foodtrucks.length);
  console.log(foodtrucks[0]);

  // Place markers on map
        // for( i = 0; i < json.length; i++) {
        //     var latLng = new google.maps.LatLng(json[i].lat, json[i].lng);
        //     var marker = new google.maps.Marker({
        //         position: latLng,
        //         map: map
        //     });
        // }
}



// function getBreweries() {
//
// }
//
// function getDistilleries() {
//
// }

function initMap() {

  getFoodtrucks();
  // getBreweries();
  // getDistilleries();

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 47.6097, lng: -122.3331}
  });

  var marker = new google.maps.Marker({
    position: {lat: 47.6220217, lng: -122.3358359},
    map: map,
    title: 'Hello World!'
  });

  // var marker2 = new google.maps.Marker({
  //   position: {lat: 47.5981458, lng: -122.3345507},
  //   map: map,
  //   title: 'Hello World2!'
  // });
}
