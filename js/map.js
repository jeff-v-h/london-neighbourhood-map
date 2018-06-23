// Initialise global variables
var map, infoWindow, defaultIcon, highlightedIcon, viewModel;

// A few initial listings of bars to start off with.
var bars = [
  {name: 'Oriole Bar', location: {lat: 51.518946, lng: -0.102813}},
  {name: 'Big Easy Bar', location: {lat: 51.510816, lng: -0.122995}},
  {name: 'Milroy\'s', location: {lat: 51.514851, lng: -0.131304}},
  {name: 'The Worlds End', location: {lat: 51.567018, lng: -0.108246}},
  {name: 'The Faltering Fullback', location: {lat: 51.568619, lng: -0.108182}},
  {name: 'London Cocktail Club', location: {lat: 51.523940, lng: -0.073050}},
  {name: 'Bar Kick', location: {lat: 51.526970, lng: -0.078200}},
  {name: 'Shakespeares Head', location: {lat: 51.513734, lng: -0.139550}}
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

  viewModel = new ViewModel();
  // Apply bindings to get ViewModel to work
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

var createMarkers = function(venues) {
  // Loop through all venues and make a marker for each one
  for (var i = 0; i < venues.length; i++) {
    var venue = venues[i];
    // push each venue into the bars array
    viewModel.barList.push(venue);
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

    // Create a single infowindow to show data about the place selected.
    // Only one will be open at a time
    var venueInfoWindow = new google.maps.InfoWindow();
    // If a marker is clicked, use the venue id to request specific data from
    // FourSquare API
    marker.addListener('click', function() {
      if (venueInfoWindow.marker == this) {
        console.log("This infowindow is already on this marker!");
      } else {
        getVenueDetails(this, venueInfoWindow);
      }
    });

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
};

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
        map.setZoom(15);
      } else {
        window.alert('We could not find that location. Try entering a more' +
          ' specific place.');
      }
    }
  );
}

// function for a get request to FourSquare to search the address specified
// On success, it will call a function to create markers for each place
function getFourSquareData(address) {
  var fourSquareUrl = 'https://api.foursquare.com/v2/venues/search';
  client_id = 'QQADBFGQZA3DVCPTFONP3VIHHMLJARSEQY0SGH4RFNSOTWGJ';
  client_secret = '0O2IQP4LFNADYTUOXN2LTYHCVCUBFH4KHRVYU5HVK2TM0ORH';
  $.ajax({
    method: 'GET',
    url: fourSquareUrl,
    dataType: 'json',
    data: {
      'client_id': client_id,
      'client_secret': client_secret,
      'near': address,
      // date/v is required for API call to work for FourSquare
      'v': '20180618',
      // categoryId specifies search to bars, breweries and lounges
      'categoryId': '4bf58dd8d48988d116941735,50327c8591d4c4b30a586d5d,4bf58dd8d48988d121941735',
      'radius': '500'
    },
    success: function(data) {
      var venueList = data.response.venues;
      // Check to see if there are any venues returned
      if (venueList.length == 0) {
        window.alert('No bars were found in this area.');
      } else {
        // Create markers for each of the venues
        createMarkers(venueList);
      }
    },
    error: function(err) {
      console.log('error:' + err);
      window.alert('An error occurred when finding bars in your specified location. Please check spelling');
    }
  });
}

// This function is called when a marker is clicked and more info is wanted 
// about a specific place. A GET request is sent to FourSquare the specific id
function getVenueDetails(marker, infowindow) {
  var fourSquareUrl = 'https://api.foursquare.com/v2/venues/';
  fourSquareUrl += marker.id
  client_id = 'QQADBFGQZA3DVCPTFONP3VIHHMLJARSEQY0SGH4RFNSOTWGJ';
  client_secret = '0O2IQP4LFNADYTUOXN2LTYHCVCUBFH4KHRVYU5HVK2TM0ORH';
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
      var venue = data.response.venue;
      // Set the marker property on thisinfowindow so it isn't created again
      infowindow.marker = marker;
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
      infowindow.setContent(innerHTML);
      infowindow.open(map, marker);
      // Make sure the marker property is cleared if the infowindow is closed
      infowindow.addListener('closeclick', function() {
        infowindow.marker = null;
      });
    },
    error: function(err) {
      console.log('error:' + err);
      window.alert('An error occurred when trying to find this bar\'s details');
    }
  });
}
