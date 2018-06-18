var map;

// Create a new blank array for all the listing markers
var markers = [];

// A few initial listings of bars to start off with. Later to get data from database 
var bars = [
  {title: 'Oriole Bar', location: {lat: 51.518946, lng: -0.102813}},
  {title: 'Big Easy Bar', location: {lat: 51.510816, lng: -0.122995}},
  {title: 'Milroy\'s', location: {lat: 51.514851, lng: -0.131304}},
  {title: 'The Worlds End', location: {lat: 51.567018, lng: -0.108246}},
  {title: 'The Faltering Fullback', location: {lat: 51.568619, lng: -0.108182}},
  {title: 'London Cocktail Club', location: {lat: 51.523940, lng: -0.073050}},
  {title: 'Bar Kick', location: {lat: 51.526970, lng: -0.078200}},
  {title: 'Shakespeares Head', location: {lat: 51.513734, lng: -0.139550}}
];

function initMap() {
  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 51.5088, lng: -0.1268},
    zoom: 13
  });

  // Initialise info window
  var infoWindow = new google.maps.InfoWindow();

  // Style the markers a bit. This will be the listing marker icon
  var defaultIcon = makeMarkerIcon('0091ff');

  // Create a "highlighted location" marker color for when the user mouses over the marker
  var highlightedIcon = makeMarkerIcon('FFFF24');

  // The following group uses the bars array to create an array of markers on initialize.
  for (var i=0; i<bars.length; i++) {
    // Get the position from the bars array
    var position = bars[i].location;
    var title = bars[i].title;
    // Create a marker per location, and put into the markers array.
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      title: title,
      animation: google.maps.Animation.DROP,
      icon: defaultIcon,
      id: i
    });
    // Push the marker to the array
    markers.push(marker);

    // When clicked, the marker will open an info window
    marker.addListener('click', function() {
      populateInfoWindow(this, infoWindow);
    });
    // Change colours of the marker when hovering over and out
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });
  }

  // When the zoom button is clicked, call the zoomToArea function which
  // zooms into the area specified
  document.getElementById('zoom-btn').addEventListener('click', function() {
    zoomToArea();
  })
}

// This function takes in a color and then creates a new marker icon of that color.
// The icon will be 21 px wide and 34 high, have an origin of 0,0 and be anchored at 10, 34
function makeMarkerIcon(markerColor) {
  var markerImage = new google.maps.MarkerImage(
    'http://chart.googleapis.com/chart?chst=d_map_spin&chld=1.15|0|'+ markerColor +
    '|40|_|%E2%80%A2',
    new google.maps.Size(21, 34),
    new google.maps.Point(0, 0),
    new google.maps.Point(10, 34),
    new google.maps.Size(21,34));
  return markerImage;
}

// A function to populate the infowwindow when the marker is clicked.
// Only one infowindow is allowed at a time at the selected markers position
function populateInfoWindow(marker, infowindow) {
  // Check to make sure infowindow is not already opened on this marker.
  if (infowindow.marker != marker) {
    infowindow.setContent('');
    infowindow.marker = marker;
    // Makre sure the marker property is cleared if the infowindow is closed.
    infowindow.addListener('closeclick', function() {
      infowindow.marker = null;
    });

    // Open the infowindow on the correct marker
    infowindow.open(map, marker);
  }
}

// This function takes the input value in the zoom-text input and zoomes in to
// focus on that area of the map
function zoomToArea() {
  // Initialise the geocoder
  var geocoder = new google.maps.Geocoder();
  // Get the address or place that the user entered.
  var address = document.getElementById('zoom-text').value;
  // Make sure the address isn't blank
  if (address == '') {
    window.alert('You must enter an area or address.');
  } else {
    // Geocode the address/area entered to get the center.
    // Then center the map on it and zoom in
    geocoder.geocode(
      {
        address: address,
        componentRestrictions: {locality: 'London'}
      }, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
          map.setCenter(results[0].geometry.location);
          map.setZoom(15);
        } else {
          window.alert('We could not find that location. Try entering a more' +
            ' specific place.');
        }
      });
  }
}