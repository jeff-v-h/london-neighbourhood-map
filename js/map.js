// Create global variables
var map, infoWindow, defaultIcon, highlightedIcon, client_id, client_secret, viewModel;

// A few initial listings of bars to start off with.
var bars = [
  {name: 'The White Swan', location: {lat: 51.51120740451686, lng: -0.12557361355990415}, id: "4fac0383e4b05cb200c3fda4"},
  {name: 'Shakespeare\'s Head (Wetherspoon)', location: {lat: 51.51675611115309, lng: -0.11968916165935206}, id: "4afd6abff964a520b62722e3"},
  {name: 'Soho House', location: {lat: 51.51332698424156, lng: -0.1306376983139466}, id: "5a68ca5766611622b6bd8451"},
  {name: 'The Old Queens Head', location: {lat: 51.5372319, lng: -0.1004195}, id: "4ac518c6f964a52034a520e3"},
  {name: 'The Islington', location: {lat: 51.53438930761333, lng: -0.10885446885104862}, id: "4ebc8058f9f48676cf72dc0c"},
  {name: 'The Princess of Shoreditch', location: {lat: 51.5253930243815, lng: -0.08389457472327243}, id: "4ad0adf5f964a5200bd920e3"},
  {name: 'The Eagle', location: {lat: 51.5285177340379, lng: -0.09194364215271887}, id: "4ad85d94f964a520161121e3"},
  {name: 'Happiness Forgets', location: {lat: 51.527746, lng: -0.081591}, id: "4d000afb21ea6ea817ce3f9f"},
  {name: 'The Pineapple', location: {lat: 51.49729153182991, lng: -0.11399775705742675}, id: "4b54de50f964a52090d027e3"},
  {name: 'The Square Pig', location: {lat: 51.51870707756146, lng: -0.1194159416426558}, id: "4ad36b7ef964a5204be420e3"},
  {name: 'Ye Olde Cock Tavern', location: {lat: 51.51392020857164, lng: -0.1106354728374241}, id: "4b589eedf964a520d16128e3"}
];

// Initialise the map and apply the knockout bindings to the ViewModel at same time.
function initMap() {
  // Default data for center of London
  var londonLocation = {lat: 51.5088, lng: -0.1268};

  // Constructor creates a new map
  map = new google.maps.Map(document.getElementById('map'), {
    center: londonLocation,
    zoom: 13
  });

  // Initialise info window
  infoWindow = new google.maps.InfoWindow();
  // Style the markers. A highlighted marker for when the mouse is hovering over one.
  defaultIcon = makeMarkerIcon('0091ff');
  highlightedIcon = makeMarkerIcon('FFFF24');

  client_id = 'QQADBFGQZA3DVCPTFONP3VIHHMLJARSEQY0SGH4RFNSOTWGJ';
  client_secret = '0O2IQP4LFNADYTUOXN2LTYHCVCUBFH4KHRVYU5HVK2TM0ORH';

  // Store a new ViewModel into a global variable
  // Apply bindings within initMap to get ViewModel to work with google maps
  viewModel = new ViewModel();
  ko.applyBindings(viewModel);
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

// This function creates markers for each bar inside the viewmodel barlist array
var createMarkers = function(venues) {
  // Loop through all venues and make a marker for each one
  for (var i = 0; i < venues.length; i++) {
    var venue = venues[i];

    // set up latlng in a format compatible with google Marker
    var latlng = {lat: venue.location.lat, lng: venue.location.lng}
    // Create a marker for each place
    var marker = new google.maps.Marker({
      map: map,
      icon: defaultIcon,
      title: venue.name,
      position: latlng,
      id: venue.id,
      animation: google.maps.Animation.DROP
    });

    // If a marker is clicked, use the venue id to request specific data from
    // FourSquare API
    marker.addListener('click', function() {
      if (infoWindow.marker == this) {
        console.log("This infowindow is already on this marker!");
      } else {
        getVenueDetails(this);
      }
    });

    // Change colours of the marker when hovering over and out
    marker.addListener('mouseover', function() {
      this.setIcon(highlightedIcon);
    });
    marker.addListener('mouseout', function() {
      this.setIcon(defaultIcon);
    });  
  }
};

// This function takes the input value in the zoom-text input and zoomes in to
// focus on that area of the map
function zoomToArea(address) {
  // Initialise the geocoder
  var geocoder = new google.maps.Geocoder();
  // Geocode the address/area entered to get the center.
  // Then center the map on it and zoom in
  geocoder.geocode(
    {
      address: address,
      componentRestrictions: {locality: 'London'}
    }, function(results, status) {
      if (status == google.maps.GeocoderStatus.OK) {
        map.setCenter(results[0].geometry.location);
        map.setZoom(16);
      } else {
        window.alert('We could not find that location. Try entering a more' +
          ' specific place.');
      }
    }
  );
}



// This function is called when a marker is clicked and more info is wanted 
// about a specific place. A GET request is sent to FourSquare the specific id
function getVenueDetails(marker) {
  var fourSquareUrl = 'https://api.foursquare.com/v2/venues/';
  fourSquareUrl += marker.id
  $.ajax({
    method: 'GET',
    url: fourSquareUrl,
    dataType: 'json',
    data: {
      'client_id': client_id,
      'client_secret': client_secret,
      'v': '20180618'
    },
    // If GET request is successful, populate the infowindow with the data
    success: function(data) {
      populateInfoWindow(marker, data);
    },
    error: function(err) {
      console.log('error:' + err);
      window.alert('An error occurred when trying to find this bar\'s details');
    }
  });
}

// A function to populate the infowwindow when the marker is clicked.
// Only one infowindow is allowed at a time at the selected markers position
function populateInfoWindow(marker, data) {
  var venue = data.response.venue;
  // Set the marker property on thisinfowindow so it isn't created again
  infoWindow.marker = marker;
  // create the HTML that is going to be seen inside the infowindow
  var innerHTML = '<div>';
  if (venue.name) {
    innerHTML += '<strong>' + venue.name + '</strong>';
  }
  if (venue.location.formattedAddress) {
    var addressArray = venue.location.formattedAddress;
    innerHTML += '<br>';
    // Create the address string
    for (i = 0; i < addressArray.length; i++) {
      // Add a comma and space before the part of address if it isn't the first one
      if (i != 0) {
        innerHTML += ', ';
      }
      innerHTML += addressArray[i]
    }
  }
  if (venue.url) {
    innerHTML += '<br>' + venue.url;
  }
  if (venue.contact && venue.contact.formattedPhone) {
    innerHTML += '<br>' + venue.contact.formattedPhone;
  }
  if (venue.hours && venue.hours.timeframes) {
    var openingTimes = venue.hours.timeframes;
    innerHTML += '<br><br><strong>Hours:</strong>';
    // loop through timeframes array to get the opening times
    for (i = 0; i < openingTimes.length; i++) {
      innerHTML += '<br>' + openingTimes[i].days + ': ' + openingTimes[i].open[0].renderedTime;
    }
  }
  innerHTML += '</div>';
  // Set the created HTML into the infowindow
  infoWindow.setContent(innerHTML);
  infoWindow.open(map, marker);
  // Make sure the marker property is cleared if the infowindow is closed
  infoWindow.addListener('closeclick', function() {
    infoWindow.marker = null;
  });
}


