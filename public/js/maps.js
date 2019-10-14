var map;
function initialize() {
  var mapOptions = {
    zoom: 15,
    center: new google.maps.LatLng(39.188155,-94.685882)
  };
  map = new google.maps.Map(document.getElementById('map'),
      mapOptions);
}

google.maps.event.addDomListener(window, 'load', initialize);