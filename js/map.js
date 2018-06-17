var map;

// Create a new blank array for all the listing markers
var markers = [];

function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.5088, lng: -0.1268},
    zoom: 13
  });

  // A few initial listings of bars to start off with. Later to get data from database 
  var bars = [
    {title: ''}
  ]	
}
