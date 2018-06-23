// Separate JavaScript file for the ViewModel. The data is currently in map.js

// A function to create an object with observables for each bar item
var Bar = function(data) {
  var self = this;
  self.name = data.name;
  self.location = data.location;
  self.id = data.id;

  // Set up latlng in a format compatible with google Marker
  var latlng = {lat: self.location.lat, lng: self.location.lng}
  // Create a marker for each place
  self.marker = new google.maps.Marker({
    map: map,
    icon: defaultIcon,
    title: self.name,
    position: latlng,
    id: self.id,
    animation: google.maps.Animation.DROP
  });

  // If a marker is clicked, use the venue id to request specific data from
  // FourSquare API
  self.marker.addListener('click', function() {
    if (infoWindow.marker == this) {
      console.log("This infowindow is already on this marker!");
    } else {
      getVenueDetails(this);
    }
  });

  // Change colours of the marker when hovering over list item
  self.highlightIcon = function() {
    self.marker.setIcon(highlightedIcon);
  };

  self.removeHighlight = function() {
    self.marker.setIcon(defaultIcon);
  };

  // change colours of the marker when hovering over the marker
  self.marker.addListener('mouseover', function() {
    this.setIcon(highlightedIcon);
  });

  self.marker.addListener('mouseout', function() {
    this.setIcon(defaultIcon);
  });

  // push marker into the markers array
  markers.push(self.marker);

  // Highlight the associated marker when a bar is clicked in the list.
  self.identifyMarker = function() {
    self.marker.setIcon(highlightedIcon);
    self.marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function() {
      self.marker.setAnimation(null);
    }, 1200);
  };
};

// The View Model to deal with everything that happens on the page
var ViewModel = function() {
  var self = this;
  self.barList = ko.observableArray([]);

  // Push initial default bars into the barList
  bars.forEach(function(bar) {
    self.barList.push( new Bar(bar) );
  });

  self.searchLocation = function() {
    // Get the address or place that the user entered.
    var address = document.getElementById('zoom-text').value;
    // Make sure the address isn't blank
    if (address == '') {
      window.alert('You must enter an area or address.');
    } else {
      // Call functions to zoom to the are on google maps
      // and to obtain data from FourSquare to make markers and infowindows
      zoomToArea(address);
      self.getFourSquareData(address);
    }
  };

  // function for a get request to FourSquare to search the address specified
  // On success, it will call a function to create markers for each place
  self.getFourSquareData = function(address) {
    var fourSquareUrl = 'https://api.foursquare.com/v2/venues/search';
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
        'radius': '300'
      },
      success: function(data) {
        var venueList = data.response.venues;
        console.log(venueList);
        // Check to see if there are any venues returned
        if (venueList.length == 0) {
          window.alert('No bars were found in this area.');
        } else {
          // Clear 'barList' and 'markers' before pushing into these arrays
          self.barList([]);
          markers = [];
          // Push each bar into the barList array. This should automatically update html <ul>
          venueList.forEach(function(bar) {
            self.barList.push( new Bar(bar) );
          });
        }
      },
      error: function(err) {
        console.log('error:' + err);
        window.alert('An error occurred when finding bars in your specified location. Please check spelling');
        return false;
      }
    });
  };
};
