function initMap() {

  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 12,
    center: {lat: 47.6097, lng: -122.3331}
  });

  var marker = new google.maps.Marker({
    position: {lat: 47.6220217, lng: -122.3358359},
    map: map,
    title: 'Hello World!'
  });

  var marker2 = new google.maps.Marker({
    position: {lat: 47.5981458, lng: -122.3345507},
    map: map,
    title: 'Hello World2!'
  });
}
